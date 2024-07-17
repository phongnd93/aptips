import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui.js/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FC } from "react";
import { SuiAuthProvider } from "./SuiAuthContext";

export const SuiProvider: FC = ({ children }) =>
{
    const queryClient = new QueryClient();

    // Config options for the networks you want to connect to
    const { networkConfig } = createNetworkConfig({
        localnet: { url: getFullnodeUrl('localnet') },
        mainnet: { url: getFullnodeUrl('mainnet') },
        devnet: { url: getFullnodeUrl('devnet') }
    });

    return <QueryClientProvider client={queryClient}>
        <SuiClientProvider defaultNetwork='devnet' networks={networkConfig}>
            <WalletProvider autoConnect>
                <SuiAuthProvider createNewAccount={true}>
                    {children}
                </SuiAuthProvider>
            </WalletProvider>
        </SuiClientProvider>
    </QueryClientProvider>
}