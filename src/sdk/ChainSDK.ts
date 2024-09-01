import { ethers, JsonRpcSigner } from "ethers";
import { KiiStargateQueryClient } from "kiijs-sdk";

export default class ChainSDK
{
    faucetUrl = "https://faucet.kiivalidator.com/api/faucet";
    chainId = "kiichain";
    network = {
        chainId: '0x75BC371', // Example Chain ID for KiiChain Testnet
        chainName: 'Kiichain Testnet',
        rpcUrls: ['https://a.sentry.testnet.kiivalidator.com:8645/',
            'https://b.sentry.testnet.kiivalidator.com:8645/'],
        nativeCurrency: {
            name: 'Kii',
            symbol: 'kii',
            decimals: 18,
        },
        blockExplorerUrls: ['https://app.kiichain.io/kiichain'],
    };

    client: KiiStargateQueryClient | undefined;
    signer: JsonRpcSigner | undefined;

    // constructor(client: KiiStargateQueryClient, signer: JsonRpcSigner)
    // {
    //     this.client = client;
    //     this.signer = signer;
    // }

    account = async () =>
    {
        try
        {
            const accounts = await window.ethereum.request({
                method: 'eth_accounts',
            });
            if (accounts?.length) return accounts[0];
        } catch (error)
        {
        }
        return null;
    };
    connect = async () =>
    {
        try
        {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: this.network.chainId }],
            });
        } catch (switchError)
        {
            if ((switchError as any).code === 4902)
            {
                try
                {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [this.network],
                    });
                } catch (addError)
                {
                    console.error('Failed to add network:', addError);
                    return;
                }
            } else
            {
                console.error('Failed to switch network:', switchError);
                return;
            }
        }

        try
        {

            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts',
            });

            return accounts;
        } catch (connectError)
        {
            console.error('Failed to connect wallet:', connectError);
        }
    };
    disconnect = async (account: string) =>
    {
        return await window.ethereum.request({
            "method": "wallet_revokePermissions",
            "params": [
                {
                    "eth_accounts": [account]
                }
            ]
        });
    };
    sendTransaction = async (toWallet: string, amount: number) =>
    {
        if (this.signer)
        {
            const tx = {
                to: toWallet,
                value: ethers.parseEther(amount.toString())
            }
            const transaction = await this.signer.sendTransaction(tx);
            return transaction.wait();
        }
        return null;
    };
    getBalance = async (account: string) =>
    {
        const balance = await this.client?.getBalance(account);
        if (balance) return Math.round(Number(BigInt(balance)) / (10 ** this.network.nativeCurrency.decimals));
        return 0;
    }
    faucetTokens = async (account: string) =>
    {
        try
        {
            // {faucetUrl}?address={address}&chainId=kiichain
            const res = await fetch(`${this.faucetUrl}?address=${account}&chainId=kiichain`, {
                method: "GET",
                headers: {
                    Accept: "application/json"
                }
            });
            return res.json();
        } catch (error)
        {
            console.log("faucetTokens : ", error);
            return null;
        }
    }
}