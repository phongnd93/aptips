import { useAccounts, useAutoConnectWallet, useConnectWallet, useCurrentAccount, useDisconnectWallet, useSignAndExecuteTransactionBlock, useSuiClient, useWallets } from "@mysten/dapp-kit";
import type { WalletAccount } from '@mysten/wallet-standard';
import { NetworkName } from "@polymedia/suits";
import { ReactNode, createContext, useEffect, useReducer, useRef, useState } from "react";
import { ActionMap } from "src/@types/auth";
import { AddUserInfoDto, UserInfoResponse } from "src/@types/dto/user-dto";
import UserServices from "src/services/UserServices";
import SuiSDK, { AccountData } from "src/suiSDK/sdk";
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { Donator, RevenueResponseDTO, Transaction, TransasctionHistory } from "src/@types/transaction";
import TransactionServices from "src/services/TransactionServices";

type SuiAuthState = {
    isInitialized: boolean,
    isAuthenticated: boolean,
    user: AccountData | null,
    wallet: WalletAccount | null,
    info: UserInfoResponse | null
}

interface SuiAuthContextType extends SuiAuthState
{
    NETWORK: NetworkName,
    balances: number,

    login: (provider: 'Google' | 'Facebook' | 'Twitch') => Promise<void>,
    fetchAccountBalance: (walletAddress: string) => Promise<void>,
    logout: () => Promise<void>,
    sendTransaction: (sourceId: number, receiver: number, toWallet: string, amout: number) => Promise<void>,
    // getRevenue: () => Promise<RevenueResponseDTO | null>,
    // getTransactions: () => Promise<Transaction[] | null>,
    // getTopDonators: () => Promise<Donator[] | null>,
}

enum Types
{
    Initial = 'INITIALIZE',
    Login = 'LOGIN',
    Logout = 'LOGOUT',
    Register = 'REGISTER',
}


type SuiAuthPayload = {
    [Types.Initial]: {
        isAuthenticated: boolean;
        user: AccountData | null;
        wallet: WalletAccount | null;
        info: UserInfoResponse | null;
    };
    [Types.Login]: {
        user: AccountData | null;
        wallet: WalletAccount | null;
        info: UserInfoResponse | null;
    };
    [Types.Logout]: undefined;
}

type SuiAuthActions = ActionMap<SuiAuthPayload>[keyof ActionMap<SuiAuthPayload>];

const initialState: SuiAuthState = {
    isInitialized: false,
    isAuthenticated: false,
    user: null,
    wallet: null,
    info: null
}

const SuiAuthReducer = (state: SuiAuthState, action: SuiAuthActions) =>
{
    switch (action.type)
    {
        case Types.Initial:
            return {
                isAuthenticated: action.payload.isAuthenticated,
                isInitialized: true,
                user: action.payload.user,
                wallet: action.payload.wallet,
                info: action.payload.info
            };
        case Types.Login:
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
                wallet: action.payload.wallet,
                info: action.payload.info
            };
        case Types.Logout:
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                wallet: null,
                action: null
            };
        default:
            return state;
    }
}

const SuiAuthContext = createContext<SuiAuthContextType | null>(null);

type SuiAuthContextProps = {
    children: ReactNode;
}

const SuiAuthProvider: React.FC<SuiAuthContextProps> = ({ children }: SuiAuthContextProps) =>
{
    const [state, dispatch] = useReducer(SuiAuthReducer, initialState);
    const suiClient = useSuiClient();
    const sdk = new SuiSDK(suiClient);
    const [balances, setBalances] = useState<number>(0); // Map<Sui address, SUI balance>
    const currentAccount = useCurrentAccount();
    const { mutate: disconnect } = useDisconnectWallet();
    const autoConnect = useAutoConnectWallet();

    const userSvc = new UserServices();
    const transSvc = new TransactionServices();

    const { mutate: signAndExecuteTransactionBlock } = useSignAndExecuteTransactionBlock();

    useEffect(() =>
    {
        if (autoConnect === 'attempted')
        {
            initialize();
        }
    }, [autoConnect, currentAccount]);

    // useEffect(() =>
    // {
    //     console.log(currentAccount);
    //     if (currentAccount && state.isInitialized && !state.isAuthenticated)
    //     {
    //         fetchAccountBalance(currentAccount.address);

    //         dispatch({
    //             type: Types.Initial,
    //             payload: {
    //                 isAuthenticated: currentAccount !== null,
    //                 user: null,
    //                 wallet: currentAccount
    //             },
    //         });
    //     }
    // }, [currentAccount]);

    const initialize = async () =>
    {
        try
        {
            let userInfo: UserInfoResponse | null = null;
            if (currentAccount)
            {
                const [bal, info] = await Promise.allSettled([fetchAccountBalance(currentAccount.address), fetchUserInfo(currentAccount.address)]);
                if (info?.status === 'fulfilled')
                {
                    if (info?.value) userInfo = info.value; else
                        userInfo = await createUser({
                            email: currentAccount.label || '',
                            walletAddress: currentAccount.address,
                            avatarUrl: ''
                        });
                }

                dispatch({
                    type: Types.Initial,
                    payload: {
                        isAuthenticated: currentAccount !== null && userInfo !== null,
                        user: null,
                        wallet: currentAccount,
                        info: userInfo
                    },
                });
                return;
            }

            let account = await sdk.completeZkLogin();
            if (!account) account = await sdk.loadAccount();

            if (account)
            {
                const [bal, info] = await Promise.allSettled([fetchAccountBalance(account.userAddr), fetchUserInfo(account.userAddr)]);
                if (info?.status === 'fulfilled')
                {
                    if (info?.value) userInfo = info.value; else
                        userInfo = await createUser({
                            email: '',
                            walletAddress: account.userAddr,
                            avatarUrl: ''
                        });
                }
                dispatch({
                    type: Types.Initial,
                    payload: {
                        isAuthenticated: account !== null && userInfo !== null,
                        user: account,
                        wallet: null,
                        info: userInfo
                    },
                });
                return;
            }
        } catch (error)
        {
            console.log('initialize', error.message);
        }
        dispatch({
            type: Types.Initial,
            payload: {
                isAuthenticated: false,
                user: null,
                wallet: null,
                info: null
            },
        });
    };

    const fetchAccountBalance = async (walletAddress: string) =>
    {
        const res = await sdk.fetchBalances(walletAddress);
        setBalances(res?.get(walletAddress) || 0);
    };

    const login = async (provider: 'Google' | 'Facebook' | 'Twitch') =>
    {
        sdk.beginZkLogin(provider);
    };

    const fetchUserInfo = async (walletAddress: string): Promise<UserInfoResponse | null> =>
    {
        const res = await userSvc.info(walletAddress);
        console.log(res);
        if (res?.status === 200) return res.data;
        return null;
    };

    const createUser = async (obj: AddUserInfoDto): Promise<UserInfoResponse | null> =>
    {
        const res = await userSvc.add(obj);
        if (res?.status === 200) return res.data;
        return null;
    };

    const logout = async () =>
    {
        sdk.clearState();
        disconnect();
        dispatch({ type: Types.Logout });
    };

    /*
    Description : Transaction functions
    */

    const sendTransaction = async (sourceId: number, receiver: number, toWallet: string, amount: number) =>
    {
        const txb = new TransactionBlock();
        const bigAmount = BigInt(amount * 10 ** 9); // 5 SUI (SUI sử dụng đơn vị 10^9, vì vậy nhân với 10^9 để chuyển đổi)
        const res = txb.splitCoins(txb.gas, [bigAmount]);
        txb.transferObjects([res[0]], txb.pure.address(toWallet));
        // debugger       
        const transHistory: TransasctionHistory = {
            sourceId,
            senderWallet: "",
            receiver,
            amount
        }
        try
        {
            if (state?.wallet)
            {
                signAndExecuteTransactionBlock({
                    transactionBlock: txb,
                    account: state.wallet,
                    chain: 'sui:devnet',
                }, {
                    onSuccess: (result) =>
                    {
                        console.log('executed transaction block', result);
                        if (result?.digest && state.wallet?.address)
                        {
                            fetchAccountBalance(state.wallet?.address);
                            transHistory.senderWallet = state.wallet.address;

                            //TODO: Add transaction history to database
                        }
                    },
                    onError: (err) =>
                    {
                        console.log('executed transaction block', err);
                    }
                });
            }
            else if (state?.user)
            {
                sdk.sendTransaction(toWallet, state.user, txb, (result) =>
                {
                    console.log('send complete', result)
                    if (result?.digest && result?.effects?.status?.status && state.user?.userAddr)
                    {
                        fetchAccountBalance(state.user.userAddr);
                        transHistory.senderWallet = state.user.userAddr;

                        //TODO: Add transaction history to database
                    }
                });
            }
        } catch (error)
        {
            console.log('sendTransaction', error);
        }
    };

    const getRevenue = async () =>
    {
        if (state?.info?.id)
        {
            return transSvc.revenue(state.info?.id);
        }
        return null;
    }

    const getTransactions = async () =>
    {
        if (state?.info?.id)
        {
            return transSvc.transactions(state.info?.id);
        }
        return null;
    }

    const getTopDonators = async () =>
    {
        if (state?.info?.id)
        {
            return transSvc.topDonators(state.info?.id, 6);
        }
        return null;
    }

    return <SuiAuthContext.Provider value={{
        balances,
        NETWORK: sdk.NETWORK,
        ...state,

        fetchAccountBalance,
        login,
        logout,

        sendTransaction,
        // getRevenue,
        // getTransactions,
        // getTopDonators
    }}>
        {children}
    </SuiAuthContext.Provider>
};

export { SuiAuthContext, SuiAuthProvider };