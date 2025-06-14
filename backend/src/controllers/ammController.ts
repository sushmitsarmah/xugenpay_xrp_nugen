import { Request, Response } from 'express';
import * as ammService from '../services/ammService';
import { success, error } from '../utils/responseHandler';
import {
    AMMAsset,
    AMMCreateBody,
    AMMDepositWithdrawBody,
    AMMVoteBody,
    AMMBidBody
} from '../types';

const createAMM = async (req: Request<any, any, AMMCreateBody>, res: Response): Promise<void> => {
    const { senderSeed, asset, asset2, amount, amount2, tradingFee } = req.body;
    try {
        const params: AMMCreateBody = {
            asset,
            asset2,
            amount,
            amount2,
            tradingFee,
        };
        if (!senderSeed) {
            return error(res, 'Sender seed is required for AMM creation.', 400);
        } 
        const result = await ammService.submitAMMTransaction('AMMCreate', senderSeed, params);
        success(res, result, 'AMM instance created successfully.');
    } catch (err: any) {
        error(res, 'Failed to create AMM', 500, err.message);
    }
};

const depositAMM = async (req: Request<any, any, AMMDepositWithdrawBody>, res: Response): Promise<void> => {
    const { senderSeed, asset, asset2, lpTokenAmount, amount, amount2 } = req.body;
    try {
        const params: AMMDepositWithdrawBody = {
            asset,
            asset2,
            lpTokenAmount,
            amount,
            amount2,
        }
        if (!senderSeed) {
            return error(res, 'Sender seed is required for AMM creation.', 400);
        } 
        const result = await ammService.submitAMMTransaction('AMMDeposit', senderSeed, params);
        success(res, result, 'Liquidity deposited into AMM.');
    } catch (err: any) {
        error(res, 'Failed to deposit liquidity to AMM', 500, err.message);
    }
};

const withdrawAMM = async (req: Request<any, any, AMMDepositWithdrawBody>, res: Response): Promise<void> => {
    const { senderSeed, asset, asset2, lpTokenAmount, amount, amount2 } = req.body;
    try {
        const params: AMMDepositWithdrawBody = {
            asset,
            asset2,
            lpTokenAmount,
            amount,
            amount2,
        }
        if (!senderSeed) {
            return error(res, 'Sender seed is required for AMM creation.', 400);
        } 
        const result = await ammService.submitAMMTransaction('AMMWithdraw', senderSeed, params);
        success(res, result, 'Liquidity withdrawn from AMM.');
    } catch (err: any) {
        error(res, 'Failed to withdraw liquidity from AMM', 500, err.message);
    }
};

const voteAMM = async (req: Request<any, any, AMMVoteBody>, res: Response): Promise<void> => {
    const { senderSeed, asset, asset2, tradingFee } = req.body;
    try {
        const params: AMMVoteBody = {
            asset,
            asset2,
            tradingFee,
        }
        if (!senderSeed) {
            return error(res, 'Sender seed is required for AMM creation.', 400);
        } 
        const result = await ammService.submitAMMTransaction('AMMVote', senderSeed, params);
        success(res, result, 'AMM trading fee vote submitted.');
    } catch (err: any) {
        error(res, 'Failed to submit AMM vote', 500, err.message);
    }
};

const bidAMM = async (req: Request<any, any, AMMBidBody>, res: Response): Promise<void> => {
    const { senderSeed, asset, asset2, bidMin, bidMax, authAccounts } = req.body;
    try {
        const params: AMMBidBody = {
            asset,
            asset2,
            bidMin,
            bidMax,
            authAccounts,
        };
        if (!senderSeed) {
            return error(res, 'Sender seed is required for AMM creation.', 400);
        } 
        const result = await ammService.submitAMMTransaction('AMMBid', senderSeed, params);
        success(res, result, 'AMM bid submitted.');
    } catch (err: any) {
        error(res, 'Failed to submit AMM bid', 500, err.message);
    }
};

const getAMMDetails = async (req: Request<{
    asset1_currency: string;
    asset1_issuer?: string;
    asset2_currency: string;
    asset2_issuer?: string;
}>, res: Response): Promise<void> => {
    const { asset1_currency, asset1_issuer, asset2_currency, asset2_issuer } = req.params;

    const asset1: AMMAsset = { currency: asset1_currency };
    if (asset1_issuer && asset1_issuer !== 'XRP') asset1.issuer = asset1_issuer; // "XRP" is a placeholder for no issuer

    const asset2: AMMAsset = { currency: asset2_currency };
    if (asset2_issuer && asset2_issuer !== 'XRP') asset2.issuer = asset2_issuer;

    try {
        const ammInfo = await ammService.getAMMInfo(asset1, asset2);
        if (ammInfo) {
            success(res, ammInfo, 'AMM details retrieved successfully.');
        } else {
            error(res, 'AMM not found for the specified assets.', 404);
        }
    } catch (err: any) {
        error(res, 'Failed to retrieve AMM details', 500, err.message);
    }
};

export {
    createAMM,
    depositAMM,
    withdrawAMM,
    voteAMM,
    bidAMM,
    getAMMDetails,
};
