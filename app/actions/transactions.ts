'use server'

import { prisma } from "@/lib/db"

export async function getAllTransactionsAction() {
    try {
        const transactions = await prisma.transaction.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                sponsor: true,
                campaign: true,
            },
        })
        return { success: true, data: transactions }
    } catch (e) {
        console.error(e)
        return { success: false, message: "Could not fetch transactions" }
    }
}

export async function getSponsorTransactionsAction(sponsorId: number) {
    try {
        const transactions = await prisma.transaction.findMany({
            where: { sponsorId },
            orderBy: { createdAt: "desc" },
            include: {
                campaign: true,
            },
        })
        return { success: true, data: transactions }
    } catch (e) {
        console.error(e)
        return { success: false, message: "Could not fetch sponsor transactions" }
    }
}

export async function getTransactionAction(id: number) {
    try {
        const tx = await prisma.transaction.findUnique({
            where: { id },
            include: { sponsor: true, campaign: true },
        })
        return { success: true, data: tx }
    } catch (e) {
        console.error(e)
        return { success: false, message: "Transaction not found" }
    }
}
