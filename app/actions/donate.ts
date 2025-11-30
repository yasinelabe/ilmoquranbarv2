'use server';

import { prisma } from '@/lib/db';
import { WaafiPay } from '@/lib/payment/waafipay';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const logger = {
    info: (message: string, context?: any) => console.log(`[INFO] ${new Date().toISOString()} - ${message}`, context),
    error: (message: string, context?: any) => console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, context),
    warn: (message: string, context?: any) => console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, context),
};

const waafi = new WaafiPay();
const waafiErrorMessages: Record<string, string> = {
    "5301": "Payment failed due to an authentication issue. Please try again later.",
    "5302": "Payment security token issue. Please try again.",
    "5303": "Invalid payment result token. Please retry the transaction.",
    "5304": "Transaction reference mismatch. Please try again.",
    "5305": "Transaction request mismatch. Please retry.",
    "5306": "You cancelled the payment.",
    "5307": "Payment session expired. Please try again.",
    "5308": "This merchant account is not enabled for payments. Please contact support.",
    "5309": "Timeout: You did not complete the payment in time.",
    "5206": "Your Account Balance is not sufficient."
};


// Validation Schema
const DonationSchema = z.object({
    campaignId: z.number(),
    amount: z.number().min(0.1),
    fullname: z.string().min(3),
    phone: z.string().min(9), // E.g., 2526...
});

export async function processDonation(prevState: any, formData: FormData) {
    const rawData = {
        campaignId: Number(formData.get('campaignId')),
        amount: Number(formData.get('amount')),
        fullname: formData.get('fullname'),
        phone: formData.get('phone'),
    };

    const initialLogContext = { phone: rawData.phone, campaignId: rawData.campaignId };
    logger.info('Starting donation process.', initialLogContext);

    // ## 1. Input Validation
    const validation = DonationSchema.safeParse(rawData);

    if (!validation.success) {
        logger.warn('Donation input validation failed.', {
            ...initialLogContext,
            errors: validation.error.flatten(),
        });
        return { success: false, message: 'Invalid input data' };
    }

    const { campaignId, amount, fullname, phone } = validation.data;
    const referenceId = uuidv4().split('-')[0].toUpperCase();
    const transactionContext = { referenceId, campaignId, amount, phone };
    logger.info('Input validated successfully.', transactionContext);

    try {
        // ## 2. Find or Create Sponsor
        let sponsor = await prisma.sponsor.findFirst({ where: { phone } });
        if (!sponsor) {
            sponsor = await prisma.sponsor.create({
                data: { fullname, phone },
            });
            logger.info('New sponsor created.', { sponsorId: sponsor.id, ...transactionContext });
        } else {
            logger.info('Existing sponsor found.', { sponsorId: sponsor.id, ...transactionContext });
        }
        
        // Update context with sponsor ID
        const finalContext = { ...transactionContext, sponsorId: sponsor.id };

        // ## 3. Create Pending Transaction
        const transaction = await prisma.transaction.create({
            data: {
                sponsorId: sponsor.id,
                campaignId,
                amount,
                referenceId,
                status: 'PENDING',
            },
        });
        
        // Update context with transaction ID
        const finalContextWithTx = { ...finalContext, transactionId: transaction.id };
        logger.info('Pending transaction created.', finalContextWithTx);

        // ## 4. Call WaafiPay Gateway
        logger.info('Calling WaafiPay purchase API.', finalContextWithTx);
        const paymentResponse = await waafi.purchase(
            { accountNo: phone },
            {
                referenceId: referenceId,
                invoiceId: transaction.id.toString(),
                amount: amount,
                currency: "USD",
                description: `Donation to Campaign #${campaignId}`,
            }
        );
        logger.info('WaafiPay response received.', { ...finalContextWithTx, response: paymentResponse });

        // ## 5. Handle Gateway Response
        if (paymentResponse.data.responseCode === '2001') {
            // Success
            await prisma.transaction.update({
                where: { id: transaction.id },
                data: { status: 'COMPLETED'},
            });
            logger.info('Transaction marked COMPLETED.', finalContextWithTx);

            // Update Campaign Collected Amount
            await prisma.campaign.update({
                where: { id: campaignId },
                data: { collectedAmount: { increment: amount } }
            });
            logger.info('Campaign collected amount updated.', finalContextWithTx);

            return { success: true, message: 'Donation successful! May Allah reward you.' };
        } else {
            // Failed at Gateway
            const gatewayError = waafiErrorMessages[paymentResponse.data.responseCode] || 'Payment failed with unknown gateway error.';
            
            await prisma.transaction.update({
                where: { id: transaction.id },
                data: { status: 'FAILED'},
            });
            logger.warn('Transaction marked FAILED due to gateway response.', {
                ...finalContextWithTx,
                responseCode: paymentResponse.data.responseCode,
                gatewayError: gatewayError,
            });

            return { success: false, message: gatewayError };
        }

    } catch (error) {
        // ## 6. Handle System/Database Errors
        const errorMessage = "We couldn't process your donation due to a system error. Please try again shortly.";
        logger.error("Donation Processing Error: Uncaught exception.", {
            ...transactionContext, // Use this for context if transactionId isn't available
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
        });

        // Attempt to update the transaction status to 'ERROR' if it was created
        if (rawData.phone && rawData.campaignId && referenceId) {
            try {
                 // ** Note: Finding by referenceId is more robust if transaction.id isn't available in catch block **
                await prisma.transaction.updateMany({
                    where: { referenceId, status: 'PENDING' },
                    data: { status: 'ERROR' },
                });
            } catch (dbError) {
                logger.error("Failed to mark PENDING transaction as ERROR after main failure.", {
                    referenceId,
                    dbError: dbError instanceof Error ? dbError.message : String(dbError),
                });
            }
        }

        return {
            success: false,
            message: errorMessage
        };
    }
}