import { Request, Response } from 'express';
import * as transactionService from '../services/transactionService';
import { success, error } from '../utils/responseHandler';
import { PaymentBody, TrustlineBody, OfferCreateBody, NFTMintBody } from '../types';

const sendPayment = async (req: Request<any, any, PaymentBody>, res: Response): Promise<void> => {
    const { senderSeed, destination, amount, destinationTag } = req.body;
    try {
        if (!senderSeed) {
            return error(res, 'Sender seed is required for payment transactions.', 400);
        }
        const result = await transactionService.submitTransactionByType('Payment', senderSeed, {
            destination,
            amount,
            destinationTag,
        });
        success(res, result, 'Payment transaction submitted.');
    } catch (err: any) {
        error(res, 'Failed to submit payment', 500, err.message);
    }
};

const createTrustline = async (req: Request<any, any, TrustlineBody>, res: Response): Promise<void> => {
    const { senderSeed, currency, issuer, limit } = req.body;
    try {
        if (!senderSeed) {
            return error(res, 'Sender seed is required for payment transactions.', 400);
        }
        const result = await transactionService.submitTransactionByType('TrustSet', senderSeed, {
            currency,
            issuer,
            limit,
        });
        success(res, result, `Trustline to ${issuer} for ${currency} created.`);
    } catch (err: any) {
        error(res, 'Failed to create trustline', 500, err.message);
    }
};

const createOffer = async (req: Request<any, any, OfferCreateBody>, res: Response): Promise<void> => {
    const { senderSeed, takerGets, takerPays } = req.body;
    try {
        if (!senderSeed) {
            return error(res, 'Sender seed is required for payment transactions.', 400);
        }
        const result = await transactionService.submitTransactionByType('OfferCreate', senderSeed, {
            takerGets,
            takerPays,
        });
        success(res, result, 'DEX offer created.');
    } catch (err: any) {
        error(res, 'Failed to create offer', 500, err.message);
    }
};

const mintNFT = async (req: Request<any, any, NFTMintBody>, res: Response): Promise<void> => {
    const { senderSeed, uri, taxon, flags, transferFee, issuer } = req.body;
    try {
        if (!senderSeed) {
            return error(res, 'Sender seed is required for payment transactions.', 400);
        }
        const result = await transactionService.submitTransactionByType('NFTokenMint', senderSeed, {
            uri,
            taxon,
            flags,
            transferFee,
            issuer,
        });
        success(res, result, 'NFT minted successfully.');
    } catch (err: any) {
        error(res, 'Failed to mint NFT. Ensure XRPL network supports XLS-20.', 500, err.message);
    }
};

export {
    sendPayment,
    createTrustline,
    createOffer,
    mintNFT,
};
