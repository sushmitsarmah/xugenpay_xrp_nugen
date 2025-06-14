import { Amount, Issue } from "xrpl";

// Common API Response types
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    errors?: any; // Consider a more specific type for errors
}

// Joi validation error detail
export interface ValidationErrorDetail {
    field: string;
    message: string;
}

// Request body interfaces for controllers
export interface FundAccountBody {
    destinationAddress: string;
    amount: string;
}

export interface PaymentBody {
    senderSeed?: string;
    destination: string;
    amount: string | Amount; // Can be XRP (string) or IOU (object)
    destinationTag?: number;
}

export interface TrustlineBody {
    senderSeed?: string;
    currency: string;
    issuer: string;
    limit: string;
}

export interface OfferCreateBody {
    senderSeed?: string;
    takerGets: string | Amount; // Can be XRP (string) or IOU (object)
    takerPays: string | Amount; // Can be XRP (string) or IOU (object)
}

export interface NFTMintBody {
    senderSeed?: string;
    uri: string;
    taxon: number;
    flags?: number; // e.g., 8 (Burnable)
    transferFee?: number; // Basis points (0-99999)
    issuer?: string; // If NFT is not self-issued
}

export interface AMMAsset {
    currency: string;
    issuer?: string; // Required for IOU, not for XRP
}

export interface AMMCreateBody {
    senderSeed?: string;
    asset: AMMAsset;
    asset2: AMMAsset;
    amount: string; // Initial amount for Asset
    amount2: string; // Initial amount for Asset2
    tradingFee: number; // Basis points (0-1000 for 0-1%)
}

export interface AMMDepositWithdrawBody {
    senderSeed?: string;
    asset: AMMAsset;
    asset2: AMMAsset;
    lpTokenAmount?: string; // For specific LP token amount (withdraw/deposit)
    amount?: string; // For depositing/withdrawing a single asset
    amount2?: string; // For depositing/withdrawing the other single asset
}

export interface AMMVoteBody {
    senderSeed?: string;
    asset: AMMAsset;
    asset2: AMMAsset;
    tradingFee: number; // New proposed trading fee
}

export interface AMMBidAuthAccount {
    Account: string; // XRPL address
}

export interface AMMBidBody {
    senderSeed?: string;
    asset: AMMAsset;
    asset2: AMMAsset;
    bidMin?: string; // Minimum LP token to bid
    bidMax?: string; // Maximum LP token to bid
    authAccounts?: AMMBidAuthAccount[]; // For multi-account bids
}

// XRPL wallet details
export interface WalletDetails {
    address: string;
    seed: string;
    publicKey: string;
}


export interface User {
    id: string; // UUID
    wallet_address: string;
    username: string;
    first_name?: string;
    last_name?: string;
    profile_image_url?: string;
    preferred_currency: 'XRP' | 'RLUSD';
    profile_url: string;
    bio?: string;
    is_verified: boolean;
    social_links?: Record<string, string>; // e.g., { twitter: "https://...", instagram: "https://..." }
    created_at: string; // ISO timestamp
}

export interface XummPayload {
    uuid: string;
    type: string; // e.g., 'signin', 'payment'
    status: 'pending' | 'signed' | 'rejected' | 'expired';
    qr_png?: string | null;
    qr_matrix?: string | null;
    next_link?: string | null;
    pushed?: boolean | null;
    resolved_account?: string | null;
    transaction_id?: string | null;
    reason?: string | null;
    expires_at: string; // ISO 8601 timestamp
    created_at?: string; // ISO 8601 timestamp
    user_id?: string | null; // UUID of the user
    original_payload_details?: Record<string, any> | null; // JSONB object
}