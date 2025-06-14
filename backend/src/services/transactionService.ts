// src/services/transactionService.ts
import { Client, Wallet, Transaction, xrpToDrops, convertStringToHex, SubmitResponse } from 'xrpl';
// Import the newly exported type from xrplService
import { SignedTransaction } from './xrplService';
import * as xrplService from './xrplService';
import {
    PaymentBody,
    TrustlineBody,
    OfferCreateBody,
    NFTMintBody,
} from '../types';

type TransactionParams = PaymentBody | TrustlineBody | OfferCreateBody | NFTMintBody;

// Use the imported type here
const buildAndSignTx = async (txType: Transaction['TransactionType'], senderSeed: string, params: TransactionParams): Promise<SignedTransaction> => {
    const client: Client = xrplService.getClient();
    const wallet: Wallet = Wallet.fromSeed(senderSeed);

    let tx: Transaction;
    const commonFields = { Account: wallet.address };

    switch (txType) {
        case 'Payment':
            const paymentParams = params as PaymentBody;
            tx = {
                ...commonFields,
                TransactionType: 'Payment',
                Destination: paymentParams.destination,
                Amount: typeof paymentParams.amount === 'object'
                    ? paymentParams.amount
                    : xrpToDrops(paymentParams.amount),
                DestinationTag: paymentParams.destinationTag,
            };
            break;
        case 'TrustSet':
            const trustlineParams = params as TrustlineBody;
            tx = {
                ...commonFields,
                TransactionType: 'TrustSet',
                LimitAmount: {
                    currency: trustlineParams.currency,
                    issuer: trustlineParams.issuer,
                    value: trustlineParams.limit,
                },
            };
            break;
        case 'OfferCreate':
            const offerParams = params as OfferCreateBody;
            tx = {
                ...commonFields,
                TransactionType: 'OfferCreate',
                TakerGets: typeof offerParams.takerGets === 'object'
                    ? offerParams.takerGets
                    : xrpToDrops(offerParams.takerGets),
                TakerPays: typeof offerParams.takerPays === 'object'
                    ? offerParams.takerPays
                    : xrpToDrops(offerParams.takerPays),
            };
            break;
        case 'NFTokenMint':
            const nftMintParams = params as NFTMintBody;
            tx = {
                ...commonFields,
                TransactionType: 'NFTokenMint',
                URI: convertStringToHex(nftMintParams.uri),
                NFTokenTaxon: nftMintParams.taxon,
                Flags: nftMintParams.flags,
                TransferFee: nftMintParams.transferFee,
            };
            if (nftMintParams.issuer && nftMintParams.issuer !== wallet.address) {
                tx.Issuer = nftMintParams.issuer;
            }
            break;
        default:
            throw new Error(`Unsupported transaction type: ${txType}`);
    }

    (Object.keys(tx) as Array<keyof Transaction>).forEach(key => tx[key] === undefined && delete tx[key]);

    const prepared = await client.autofill(tx);
    const signed: SignedTransaction = wallet.sign(prepared); // Use the imported type here
    return signed;
};

const submitTransactionByType = async (txType: Transaction['TransactionType'], senderSeed: string, params: TransactionParams): Promise<SubmitResponse> => {
    try {
        const signedTx = await buildAndSignTx(txType, senderSeed, params);
        const result = await xrplService.submitTransaction(signedTx.tx_blob);
        return result;
    } catch (error) {
        console.error(`Error submitting ${txType} transaction:`, error);
        throw error;
    }
};

export {
    submitTransactionByType,
};