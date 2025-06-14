-- Create the 'users' table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    profile_image_url TEXT,
    preferred_currency TEXT DEFAULT 'XRP' NOT NULL,
    profile_url TEXT,
    bio TEXT,
    is_verified BOOLEAN DEFAULT FALSE NOT NULL,
    social_links JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Indexes for faster lookups on 'users'
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON public.users USING btree (wallet_address);
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users USING btree (username);


-- Create the 'xumm_payloads' table to store payload details
CREATE TABLE IF NOT EXISTS public.xumm_payloads (
    uuid TEXT PRIMARY KEY,
    type TEXT NOT NULL, -- e.g., 'signin', 'payment'
    status TEXT DEFAULT 'pending' NOT NULL, -- e.g., 'pending', 'signed', 'rejected', 'expired'
    qr_png TEXT,
    qr_matrix TEXT,
    next_link TEXT,
    pushed BOOLEAN,
    resolved_account TEXT, -- The XRP account that signed/rejected (for signin/payment source)
    transaction_id TEXT, -- XRP Ledger transaction ID (for payments)
    reason TEXT, -- Rejection reason
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL, -- When the payload expires in XUMM
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL, -- Link to the user if applicable
    original_payload_details JSONB -- Store the original transaction request payload for reference
);

-- Index for faster lookups on 'xumm_payloads'
CREATE INDEX IF NOT EXISTS idx_xumm_payloads_resolved_account ON public.xumm_payloads USING btree (resolved_account);