"use client";

import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { BitgetWallet } from "@bitget-wallet/aptos-wallet-adapter";
import { MartianWallet } from "@martianwallet/aptos-wallet-adapter";
import { MSafeWalletAdapter } from "@msafe/aptos-wallet-adapter";
import { OKXWallet } from "@okwallet/aptos-wallet-adapter";
import { PontemWallet } from "@pontem/wallet-adapter-plugin";
import { TrustWallet } from "@trustwallet/aptos-wallet-adapter";
import { FewchaWallet } from "fewcha-plugin-wallet-adapter";
import { FC } from "react";
import { Network } from "@aptos-labs/ts-sdk";

export const AptosWalletProvider: FC = ({ children }) =>
{
  const wallets = [
    new BitgetWallet(),
    new FewchaWallet(),
    new MartianWallet(),
    new MSafeWalletAdapter(),
    new PontemWallet(),
    new TrustWallet(),
    new OKXWallet(),
  ];

  return (
    <AptosWalletAdapterProvider
      plugins={wallets}
      autoConnect={true}
      dappConfig={{
        network: Network.TESTNET,
        mizuwallet: {
          manifestURL:
            "https://assets.mz.xyz/static/config/mizuwallet-connect-manifest.json",
        },
      }}
      optInWallets={[]}
      onError={(error) =>
      {
        console.log(error);
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
};
