import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { error } from '../utils/responseHandler';
import {
    FundAccountBody,
    PaymentBody,
    TrustlineBody,
    OfferCreateBody,
    NFTMintBody,
    AMMCreateBody,
    AMMDepositWithdrawBody,
    AMMVoteBody,
    AMMBidBody,
    AMMAsset // for internal Joi types
} from '../types';

type SchemaType = Joi.ObjectSchema<any>;

const validate = (schema: SchemaType) => (req: Request, res: Response, next: NextFunction): void => {
    const { error: validationError } = schema.validate(req.body, { abortEarly: false });
    if (validationError) {
        const errors = validationError.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message,
        }));
        return error(res, 'Validation Error', 400, errors);
    }
    next();
};

// Helper for Amount schema (XRP or IOU)
const AmountSchema = Joi.alternatives().try(
    Joi.string().pattern(/^\d+(\.\d+)?$/), // For XRP (as string of drops)
    Joi.object({ // For IOU
        currency: Joi.string().required(),
        value: Joi.string().required().pattern(/^\d+(\.\d+)?$/),
        issuer: Joi.string().pattern(/^r[1-9A-HJ-NP-Za-km-z]{25,34}$/).allow('').messages({
            'string.pattern.base': 'Invalid issuer XRP address format.',
        }),
    })
);

// Helper for AMM Asset schema
const AMMAssetSchema = Joi.object<AMMAsset>({
    currency: Joi.string().required(),
    issuer: Joi.string().pattern(/^r[1-9A-HJ-NP-Za-km-z]{25,34}$/).optional().allow('')
});


const schemas = {
    fundAccountSchema: Joi.object<FundAccountBody>({
        destinationAddress: Joi.string().required().pattern(/^r[1-9A-HJ-NP-Za-km-z]{25,34}$/).messages({
            'string.pattern.base': 'Invalid XRP address format.',
        }),
        amount: Joi.string().required().pattern(/^\d+(\.\d+)?$/).messages({
            'string.pattern.base': 'Amount must be a positive number string.',
        }),
    }),

    paymentSchema: Joi.object<PaymentBody>({
        senderSeed: Joi.string().required().messages({
            'string.empty': 'Sender seed is required.',
        }),
        destination: Joi.string().required().pattern(/^r[1-9A-HJ-NP-Za-km-z]{25,34}$/).messages({
            'string.pattern.base': 'Invalid destination XRP address format.',
        }),
        amount: AmountSchema.required(),
        destinationTag: Joi.number().integer().min(0).optional(),
    }),

    trustlineSchema: Joi.object<TrustlineBody>({
        senderSeed: Joi.string().required(),
        currency: Joi.string().required().length(3),
        issuer: Joi.string().required().pattern(/^r[1-9A-HJ-NP-Za-km-z]{25,34}$/),
        limit: Joi.string().pattern(/^\d+(\.\d+)?$/).required(),
    }),

    offerCreateSchema: Joi.object<OfferCreateBody>({
        senderSeed: Joi.string().required(),
        takerGets: AmountSchema.required(),
        takerPays: AmountSchema.required(),
    }),

    nftMintSchema: Joi.object<NFTMintBody>({
        senderSeed: Joi.string().required(),
        uri: Joi.string().uri().required(),
        flags: Joi.number().integer().min(0).optional(),
        transferFee: Joi.number().integer().min(0).max(99999).optional(),
        taxon: Joi.number().integer().min(0).required(),
        issuer: Joi.string().pattern(/^r[1-9A-HJ-NP-Za-km-z]{25,34}$/).optional().allow(''),
    }),

    ammCreateSchema: Joi.object<AMMCreateBody>({
        senderSeed: Joi.string().required(),
        asset: AMMAssetSchema.required(),
        asset2: AMMAssetSchema.required(),
        amount: Joi.string().required().pattern(/^\d+(\.\d+)?$/),
        amount2: Joi.string().required().pattern(/^\d+(\.\d+)?$/),
        tradingFee: Joi.number().integer().min(0).max(1000).required()
    }),

    ammDepositWithdrawSchema: Joi.object<AMMDepositWithdrawBody>({
        senderSeed: Joi.string().required(),
        asset: AMMAssetSchema.required(),
        asset2: AMMAssetSchema.required(),
        lpTokenAmount: Joi.string().pattern(/^\d+(\.\d+)?$/).optional(),
        amount: Joi.string().pattern(/^\d+(\.\d+)?$/).optional(),
        amount2: Joi.string().pattern(/^\d+(\.\d+)?$/).optional()
    }).xor('lpTokenAmount', 'amount', 'amount2'),

    ammVoteSchema: Joi.object<AMMVoteBody>({
        senderSeed: Joi.string().required(),
        asset: AMMAssetSchema.required(),
        asset2: AMMAssetSchema.required(),
        tradingFee: Joi.number().integer().min(0).max(1000).required()
    }),

    ammBidSchema: Joi.object<AMMBidBody>({
        senderSeed: Joi.string().required(),
        asset: AMMAssetSchema.required(),
        asset2: AMMAssetSchema.required(),
        bidMin: Joi.string().pattern(/^\d+(\.\d+)?$/).optional(),
        bidMax: Joi.string().pattern(/^\d+(\.\d+)?$/).optional(),
        authAccounts: Joi.array().items(
            Joi.object({
                Account: Joi.string().required().pattern(/^r[1-9A-HJ-NP-Za-km-z]{25,34}$/)
            })
        ).optional()
    }),
};

export {
    validate,
    schemas,
};
