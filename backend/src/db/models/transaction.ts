// src/models/transaction.ts
export interface Transaction {
    transactionId: string;
    senderId: string;
    recipientId: string;
    amount: number;
    description: string;
    timestamp: string; // ISO string
    status: 'pending' | 'completed' | 'failed';
}