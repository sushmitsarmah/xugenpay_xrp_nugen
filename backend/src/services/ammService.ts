// src/services/ammService.ts
import {
    Client,
    Wallet,
    Transaction,
    SubmitResponse,
    AMMInfoResponse,
    SubmittableTransaction,
    type AMMCreate,
    type AMMDeposit,
    type AMMWithdraw,
    type AMMVote,
    type AMMBid,
} from 'xrpl';
// Import the newly exported type from xrplService
import { SignedTransaction } from './xrplService';
import * as xrplService from './xrplService';
import {
    AMMAsset,
    AMMCreateBody,
    AMMDepositWithdrawBody,
    AMMVoteBody,
    AMMBidBody,
} from '../types';

type AMMTransactionParams = AMMCreateBody | AMMDepositWithdrawBody | AMMVoteBody | AMMBidBody;

// Use the imported type here
const buildAndSignAMMTransaction = async (
    txType: Transaction['TransactionType'],
    senderSeed: string,
    params: AMMTransactionParams
): Promise<SignedTransaction> => {
    const client: Client = xrplService.getClient();
    const wallet: Wallet = Wallet.fromSeed(senderSeed);

    const asset1: AMMAsset = (params as AMMCreateBody).asset || (params as AMMDepositWithdrawBody).asset || (params as AMMVoteBody).asset || (params as AMMBidBody).asset;
    const asset2: AMMAsset = (params as AMMCreateBody).asset2 || (params as AMMDepositWithdrawBody).asset2 || (params as AMMVoteBody).asset2 || (params as AMMBidBody).asset2;

    // let tx: Transaction;
    let tx: any;
    const commonTxFields = {
        Account: wallet.address,
        Asset: asset1,
        Asset2: asset2,
    };

    let temp: any = {};
    switch (txType) {
        case 'AMMCreate':
            const createParams = params as AMMCreateBody;
            temp = {
                TransactionType: 'AMMCreate',
                // ...commonTxFields,
                Amount: createParams.amount,
                Amount2: createParams.amount2,
                TradingFee: createParams.tradingFee,
            };
            tx = temp as AMMCreate;
            break;
        case 'AMMDeposit':
            const depositParams = params as AMMDepositWithdrawBody;
            temp = {
                TransactionType: 'AMMDeposit',
                ...commonTxFields,
            };
            if (depositParams.lpTokenAmount) {
                temp.LPTokenOut = depositParams.lpTokenAmount;
            } else if (depositParams.amount && depositParams.amount2) {
                temp.Amount = depositParams.amount;
                temp.Amount2 = depositParams.amount2;
            } else if (depositParams.amount) {
                temp.Amount = depositParams.amount;
            } else if (depositParams.amount2) {
                temp.Amount2 = depositParams.amount2;
            } else {
                throw new Error('AMMDeposit requires lpTokenIn, or (amount and amount2), or just amount, or just amount2');
            }
            tx = { ...temp } as AMMDeposit
            break;
        case 'AMMWithdraw':
            const withdrawParams = params as AMMDepositWithdrawBody;
            temp = {
                TransactionType: 'AMMWithdraw',
                ...commonTxFields,
            };
            if (withdrawParams.lpTokenAmount) {
                temp.LPTokenOut = withdrawParams.lpTokenAmount;
            } else if (withdrawParams.amount && withdrawParams.amount2) {
                temp.Amount = withdrawParams.amount;
                temp.Amount2 = withdrawParams.amount2;
            } else if (withdrawParams.amount) {
                temp.Amount = withdrawParams.amount;
            } else if (withdrawParams.amount2) {
                temp.Amount2 = withdrawParams.amount2;
            } else {
                throw new Error('AMMWithdraw requires lpTokenOut, or (amount and amount2), or just amount, or just amount2');
            }
            tx = { ...temp } as AMMWithdraw;
            break;
        case 'AMMVote':
            const voteParams = params as AMMVoteBody;
            temp = {
                TransactionType: 'AMMVote',
                ...commonTxFields,
                TradingFee: voteParams.tradingFee,
            };
            tx = { ...temp } as AMMVote;
            break;
        case 'AMMBid':
            const bidParams = params as AMMBidBody;
            temp = {
                TransactionType: 'AMMBid',
                ...commonTxFields,
            };
            if (bidParams.bidMin) temp.BidMin = bidParams.bidMin;
            if (bidParams.bidMax) temp.BidMax = bidParams.bidMax;
            if (bidParams.authAccounts && bidParams.authAccounts.length > 0) {
                temp.AuthAccounts = bidParams.authAccounts.map(account => ({ Account: account.Account }));
            }
            tx = { ...temp } as AMMBid;
            break;
        default:
            throw new Error(`Unsupported AMM transaction type: ${txType}`);
    }

    (Object.keys(tx) as Array<keyof Transaction>).forEach(key => tx[key] === undefined && delete tx[key]);

    const prepared = await client.autofill(tx as SubmittableTransaction);
    const signed: SignedTransaction = wallet.sign(prepared); // Use the imported type here
    return signed;
};

const submitAMMTransaction = async (
    txType: Transaction['TransactionType'],
    senderSeed: string,
    params: AMMTransactionParams
): Promise<SubmitResponse> => {
    try {
        const signedTx = await buildAndSignAMMTransaction(txType, senderSeed, params);
        const result = await xrplService.submitTransaction(signedTx.tx_blob);
        return result;
    } catch (error) {
        console.error(`Error submitting AMM ${txType} transaction:`, error);
        throw error;
    }
};

const getAMMInfo = async (asset: AMMAsset, asset2: AMMAsset): Promise<AMMInfoResponse['result']['amm'] | null> => {
    try {
        const client = xrplService.getClient();
        const response = await client.request({
            command: 'amm_info',
            Asset: asset,
            Asset2: asset2,
            ledger_index: 'current',
        });
        return response.result.amm;
    } catch (error: any) {
        if (error.data && error.data.error === 'ammNotFound') {
            return null;
        }
        console.error(`Error getting AMM info for ${asset.currency}/${asset2.currency}:`, error);
        throw error;
    }
};

export {
    submitAMMTransaction,
    getAMMInfo,
};