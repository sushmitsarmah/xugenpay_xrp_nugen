// src/services/accountService.ts
import { Wallet, xrpToDrops, AccountInfoResponse, SubmittableTransaction } from 'xrpl';
import * as xrplService from './xrplService';
import config from '../config';
import { WalletDetails } from '../types';

const generateWallet = (): WalletDetails => {
    const wallet = Wallet.generate();
    return {
        address: wallet.address,
        seed: wallet.seed || '',
        publicKey: wallet.publicKey,
    };
};

const getAccountInfo = async (address: string): Promise<AccountInfoResponse['result']['account_data'] | { message: string; address: string; balance: string }> => {
    try {
        const client = xrplService.getClient();
        const response = await client.request({
            command: 'account_info',
            account: address,
            ledger_index: 'current',
        });
        return response.result.account_data;
    } catch (error: any) { // Catch as 'any' then narrow if needed for specific error types
        if (error.data && error.data.error === 'actNotFound') {
            return {
                message: 'Account not found (may not be funded yet).',
                address: address,
                balance: '0', // Accounts have 0 balance if not funded
            };
        }
        console.error(`Error getting account info for ${address}:`, error);
        throw error;
    }
};

const fundAccount = async (destinationAddress: string, amount: string) => {
    if (!config.xrpl.masterAccountSeed) {
        throw new Error('MASTER_ACCOUNT_SEED is not configured in .env. Cannot fund accounts.');
    }

    try {
        const client = xrplService.getClient();
        const masterWallet = Wallet.fromSeed(config.xrpl.masterAccountSeed);

        const paymentTx: SubmittableTransaction = {
            TransactionType: 'Payment',
            Account: masterWallet.address,
            Amount: xrpToDrops(amount),
            Destination: destinationAddress,
        };

        const prepared = await client.autofill(paymentTx);
        const signed = masterWallet.sign(prepared);
        const result = await client.submit(signed.tx_blob);

        if (result.result.engine_result !== 'tesSUCCESS') {
            const errorMessage = `Funding failed: ${result.result.engine_result} - ${result.result.engine_result_message}`;
            console.error(errorMessage, result.result);
            throw new Error(errorMessage);
        }
        return result;

    } catch (error) {
        console.error('Error funding account:', error);
        throw error;
    }
};

export {
    generateWallet,
    getAccountInfo,
    fundAccount,
};
