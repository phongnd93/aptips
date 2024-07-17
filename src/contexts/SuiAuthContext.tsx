import { useAccounts, useAutoConnectWallet, useConnectWallet, useCurrentAccount, useDisconnectWallet, useSuiClient, useWallets } from "@mysten/dapp-kit";
import type { WalletAccount } from '@mysten/wallet-standard';
import { NetworkName } from "@polymedia/suits";
import { ReactNode, createContext, useEffect, useReducer, useRef, useState } from "react";
import { ActionMap } from "src/@types/auth";
import SuiSDK, { AccountData } from "src/suiSDK/sdk";

type SuiAuthState = {
    isInitialized: boolean,
    isAuthenticated: boolean,
    user: AccountData | null,
    wallet: WalletAccount | null
}

interface SuiAuthContextType extends SuiAuthState
{
    NETWORK: NetworkName,
    balances: number,

    login: (provider: 'Google' | 'Facebook' | 'Twitch') => Promise<void>,
    fetchAccountBalance: (walletAddress: string) => Promise<void>,
    logout: () => Promise<void>
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
    };
    [Types.Login]: {
        user: AccountData | null;
        wallet: WalletAccount | null;
    };
    [Types.Logout]: undefined;
}

type SuiAuthActions = ActionMap<SuiAuthPayload>[keyof ActionMap<SuiAuthPayload>];

const initialState: SuiAuthState = {
    isInitialized: false,
    isAuthenticated: false,
    user: null,
    wallet: null
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
                wallet: action.payload.wallet
            };
        case Types.Login:
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
                wallet: action.payload.wallet
            };
        case Types.Logout:
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                wallet: null
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
    const isInit = useRef(false);
    const currentAccount = useCurrentAccount();
    const { mutate: disconnect } = useDisconnectWallet();
    const autoConnect = useAutoConnectWallet();
    useEffect(() =>
    {
        if (autoConnect === 'attempted')
        {
            console.log(autoConnect);
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
            if (currentAccount)
            {
                await fetchAccountBalance(currentAccount.address);

                dispatch({
                    type: Types.Initial,
                    payload: {
                        isAuthenticated: currentAccount !== null,
                        user: null,
                        wallet: currentAccount
                    },
                });
                return;
            }

            let account = await sdk.completeZkLogin();
            if (!account) account = await sdk.loadAccount();

            if (account)
            {
                await fetchAccountBalance(account.userAddr);

                dispatch({
                    type: Types.Initial,
                    payload: {
                        isAuthenticated: account !== null,
                        user: account,
                        wallet: null
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
                wallet: null
            },
        });
    };

    const fetchAccountBalance = async (walletAddress: string) =>
    {
        const res = await sdk.fetchBalances(walletAddress);

        setBalances(res?.get(walletAddress) || 0);
    }

    const login = async (provider: 'Google' | 'Facebook' | 'Twitch') =>
    {
        sdk.beginZkLogin(provider);

    };

    const logout = async () =>
    {
        sdk.clearState();
        disconnect();
        dispatch({ type: Types.Logout });
    };

    return <SuiAuthContext.Provider value={{
        balances,
        NETWORK: sdk.NETWORK,
        ...state,

        fetchAccountBalance,
        login,
        logout
    }}>
        {children}
    </SuiAuthContext.Provider>
};

export { SuiAuthContext, SuiAuthProvider };