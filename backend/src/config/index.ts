import dotenv from 'dotenv';

dotenv.config();

interface XRPLConfig {
    testnetServerUrl: string;
    devnetServerUrl: string;
    masterAccountSeed?: string; // Optional: Only for dev/testnet funding
}

interface AppConfig {
    port: number;
    xrpl: XRPLConfig;
}

const config: AppConfig = {
    port: parseInt(process.env.PORT || '3000', 10),
    xrpl: {
        testnetServerUrl: process.env.XRPL_SERVER_URL || 'wss://s.altnet.rippletest.net:51233',
        devnetServerUrl: process.env.XRPL_DEVNET_URL || 'wss://s.devnet.rippletest.net:51233',
        masterAccountSeed: process.env.MASTER_ACCOUNT_SEED,
    },
};

export default config;
