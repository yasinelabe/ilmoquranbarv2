import axios, { AxiosInstance, AxiosError } from 'axios';
import { v4 as uuidv4 } from 'uuid';

// -------------------------
// Interfaces & Types
// -------------------------
export interface WaafiConfig {
    merchantUid?: string;
    apiUserId?: string;
    apiKey?: string;
    baseUrl?: string;
    timeoutMs?: number;
}

export interface PayerInfo {
    accountNo: string;
}

export interface TransactionInfo {
    referenceId: string;
    invoiceId: string;
    amount: number;
    currency?: string;
    description?: string;
    paymentMethod?: string;
}

interface WaafiPayload {
    schemaVersion: string;
    requestId: string;
    timestamp: string;
    channelName: string;
    serviceName: string;
    serviceParams: Record<string, unknown>;
}

const DEFAULT_SCHEMA = '1.0';

// -------------------------
// WaafiPay Client
// -------------------------
export class WaafiPay {
    private merchantUid: string;
    private apiUserId: string;
    private apiKey: string;
    private baseUrl: string;
    private axios: AxiosInstance;

    constructor({
        merchantUid,
        apiUserId,
        apiKey,
        baseUrl,
        timeoutMs = 200000,
    }: WaafiConfig = {}) {

        this.merchantUid = merchantUid || process.env.WAAFI_MERCHANT_UID || '';
        this.apiUserId = apiUserId || process.env.WAAFI_API_USER_ID || '';
        this.apiKey = apiKey || process.env.WAAFI_API_KEY || '';
        this.baseUrl =
            (process.env.WAAFI_BASE_URL || baseUrl || 'https://api.waafipay.com')
                .replace(/\/$/, '');

        if (!this.merchantUid || !this.apiUserId || !this.apiKey) {
            throw new Error('WaafiPay: Missing required credentials (merchantUid, apiUserId, apiKey)');
        }

        this.axios = axios.create({
            baseURL: this.baseUrl,
            timeout: timeoutMs,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // -------------------------
    // Build Request Payload
    // -------------------------
    private buildPayload(
        serviceName: string,
        payerInfo: PayerInfo,
        txInfo: TransactionInfo
    ): WaafiPayload {
        return {
            schemaVersion: DEFAULT_SCHEMA,
            requestId: uuidv4(),
            timestamp: new Date().toISOString(),
            channelName: 'WEB',
            serviceName,
            serviceParams: {
                merchantUid: this.merchantUid,
                apiUserId: this.apiUserId,
                apiKey: this.apiKey,
                paymentMethod: txInfo.paymentMethod || 'MWALLET_ACCOUNT',
                payerInfo,
                transactionInfo: txInfo,
            },
        };
    }

    // -------------------------
    // Error Normalization
    // -------------------------
    private normalizeError(error: any) {
        const axiosErr = error as AxiosError;

        if (axiosErr.code === 'ECONNABORTED') {
            return {
                ok: false,
                type: 'timeout',
                message: 'WaafiPay request timed out',
            };
        }

        if (axiosErr.response) {
            return {
                ok: false,
                type: 'http',
                status: axiosErr.response.status,
                data: axiosErr.response.data,
                message: 'WaafiPay responded with an error',
            };
        }

        if (axiosErr.request) {
            return {
                ok: false,
                type: 'network',
                message: 'Network error contacting WaafiPay gateway',
            };
        }

        return {
            ok: false,
            type: 'unknown',
            message: axiosErr.message || 'Unknown error',
        };
    }

    // -------------------------
    // Purchase API
    // -------------------------
    async purchase(
        payerInfo: PayerInfo,
        txInfo: TransactionInfo
    ): Promise<any> {
        const payload = this.buildPayload('API_PURCHASE', payerInfo, txInfo);

        try {
            const { data } = await this.axios.post('/asm', payload);
            return {
                ok: true,
                data,
            };
        } catch (error) {
            return this.normalizeError(error);
        }
    }
}
