import { Request, Response } from 'express';
import * as accountService from '../services/accountService';
import { success, error } from '../utils/responseHandler';
import { FundAccountBody } from '../types';
import { AccountInfoResponse } from 'xrpl';

const createWallet = (req: Request, res: Response): void => {
    try {
        const wallet = accountService.generateWallet();
        success(res, wallet, 'New XRP wallet generated successfully.');
    } catch (err: any) {
        error(res, 'Failed to generate wallet', 500, err.message);
    }
};

const getAccountDetails = async (req: Request, res: Response): Promise<void> => {
    const { address } = req.params;
    try {
        // The return type of getAccountInfo can be either AccountInfoResponse or a custom object.
        // We ensure `success` handles it or cast it if needed.
        const accountInfo = await accountService.getAccountInfo(address);
        if ('message' in accountInfo && accountInfo.message === 'Account not found (may not be funded yet).') {
             success(res, accountInfo, accountInfo.message, 200); // Return 200 for not found but handled
        } else {
             success(res, accountInfo as AccountInfoResponse['result']['account_data'], `Account info for ${address}`);
        }
    } catch (err: any) {
        error(res, 'Failed to retrieve account info', 500, err.message);
    }
};

const fundAccount = async (req: Request<any, any, FundAccountBody>, res: Response): Promise<void> => {
    const { destinationAddress, amount } = req.body;
    try {
        const result = await accountService.fundAccount(destinationAddress, amount);
        success(res, result, `Account ${destinationAddress} funded with ${amount} XRP.`);
    } catch (err: any) {
        error(res, 'Failed to fund account', 500, err.message);
    }
};

export {
    createWallet,
    getAccountDetails,
    fundAccount,
};
