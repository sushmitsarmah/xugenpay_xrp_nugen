import { SquidWidget } from "@0xsquid/widget";

const INTEGRATOR_ID = import.meta.env.VITE_SQUID_INTEGRATOR_ID || "";
const SQUID_API_URL = import.meta.env.VITE_SQUID_API_URL || "https://v2.api.squidrouter.com";

const SquidSwap = () => {
    return (
        <SquidWidget
            config={{
                integratorId: INTEGRATOR_ID,
                apiUrl: SQUID_API_URL,
                defaultTokensPerChain: [
                    {
                        address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                        chainId: "1",
                    },
                ],
                initialAssets: {
                    from: {
                        address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                        chainId: "1",
                    },
                    to: {
                        address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                        chainId: "42161",
                    },
                },
            }}
        />
    );
};

export default SquidSwap;