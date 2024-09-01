import { ethers, JsonRpcSigner } from "ethers";
import { KiiStargateQueryClient } from "kiijs-sdk";
import React, { createContext, FC, ReactNode, useEffect, useLayoutEffect, useReducer, useRef, useState } from "react";
import { ActionMap } from "src/@types/auth";
import { AddUserInfoDto, UserInfoResponse } from "src/@types/dto/user-dto";
import { TransasctionHistory } from "src/@types/transaction";
import ChainSDK from "src/sdk/ChainSDK";
import FaucetServices from "src/services/FaucetServices";
import UserServices from "src/services/UserServices";

type AuthState = {
    isInitialized: boolean,
    isAuthenticated: boolean,
    firstLogin: boolean,
    metamaskInstalled: boolean,
    user: any | null,
    wallet: any | null,
    info: UserInfoResponse | null,
}

enum Types
{
    Initial = 'INITIALIZE',
    Login = 'LOGIN',
    Logout = 'LOGOUT',
    UpdateProfile = 'UPDATE_PROFILE',
    Register = 'REGISTER',
}

type AuthPayload = {
    [Types.Initial]: {
        isAuthenticated: boolean;
        firstLogin: boolean;
        metamaskInstalled: boolean;
        user: any | null;
        wallet: any | null;
        info: UserInfoResponse | null;
    };
    [Types.Login]: {
        firstLogin: boolean;
        metamaskInstalled: boolean;
        user: any | null;
        wallet: any | null;
        info: UserInfoResponse | null;
    };
    [Types.UpdateProfile]: {
        metamaskInstalled: boolean;
        firstLogin: boolean;
        info: UserInfoResponse | null;
    };
    [Types.Logout]: undefined;
}

type AuthActions = ActionMap<AuthPayload>[keyof ActionMap<AuthPayload>];

const initialState: AuthState = {
    metamaskInstalled: false,
    isInitialized: false,
    isAuthenticated: false,
    firstLogin: false,
    user: null,
    wallet: null,
    info: null
}

const AuthReducer = (state: AuthState, action: AuthActions) =>
{
    switch (action.type)
    {
        case Types.Initial:
            return {
                isAuthenticated: action.payload.isAuthenticated,
                metamaskInstalled: action.payload.metamaskInstalled,
                isInitialized: true,
                firstLogin: action.payload.firstLogin,
                user: action.payload.user,
                wallet: action.payload.wallet,
                info: action.payload.info
            };
        case Types.Login:
            return {
                ...state,
                isInitialized: true,
                firstLogin: action.payload.firstLogin,
                isAuthenticated: true,
                user: action.payload.user,
                wallet: action.payload.wallet,
                info: action.payload.info
            };
        case Types.UpdateProfile:
            return {
                ...state,
                firstLogin: action.payload.firstLogin,
                info: action.payload.info
            };
        case Types.Logout:
            return {
                ...state,
                isAuthenticated: false,
                firstLogin: false,
                user: null,
                wallet: null,
                action: null
            };
        default:
            return state;
    }
}

interface ChainContextType extends AuthState
{
    balances: number,
    loadingBalance: boolean,

    fetchAccountBalance: (walletAddress: string) => Promise<void>,
    logout: () => Promise<void>,
    sendTransaction: (toWallet: string, amout: number, onDonateSuccess: (trans: TransasctionHistory) => void) => Promise<void>,
    fetchUserInfoById: (id: number) => Promise<UserInfoResponse | null>,
    updateProfile: (info?: UserInfoResponse) => void,
    login: () => Promise<void>,
    requestTokenFromFaucet: () => Promise<any>
    // getRevenue: () => Promise<RevenueResponseDTO | null>,
    // getTransactions: () => Promise<Transaction[] | null>,
    // getTopDonators: () => Promise<Donator[] | null>,
}

const ChainContext = createContext<ChainContextType | null>(null);

type ChainContextProps = {
    children: ReactNode,
    createnewAccount: boolean
};

const ChainProvider: FC<ChainContextProps> = ({ children, createnewAccount }: ChainContextProps) =>
{
    const [state, dispatch] = useReducer(AuthReducer, initialState);
    const [balances, setBalances] = useState<number>(0);
    const [loadingBalance, setLoadingBalance] = useState(false);
    const [meta, setMeta] = useState(typeof window !== undefined);
    const [client, setClient] = useState<KiiStargateQueryClient>();
    // const [signer, setSigner] = useState<JsonRpcSigner>();
    const userSvc = new UserServices();
    const faucetSvc = new FaucetServices();

    const sdk = useRef(new ChainSDK()).current;
    const init = useRef(false);
    useEffect(() =>
    {
        if (!init.current)
        {
            initClient();
        }
        return () =>
        {
            init.current = true;
        }
    }, []);
    useEffect(() =>
    {
        if (client)
        {
            if (createnewAccount)
                initialize();
            else initWithoutCreateNewAccount();
        }
    }, [client, meta]);

    const initClient = async () =>
    {
        const client = await KiiStargateQueryClient.connect(
            sdk.network.rpcUrls[0]
        );
        setClient(client);
    }

    const initialize = async () =>
    {
        let firstLogin = false;
        try
        {
            let userInfo: UserInfoResponse | null = null;
            if (meta)
            {
                sdk.client = client;
                const address = await sdk.account();
                if (address)
                {
                    const signer = await getSigner();
                    sdk.signer = signer;
                    const info = await fetchUserInfo(address);
                    fetchAccountBalance(address);
                    if (info) userInfo = info; else
                    {
                        firstLogin = true;
                        userInfo = await createUser({
                            email: '',
                            walletAddress: address,
                            avatarUrl: '', about: '', fullName: ''
                        });
                    }
                    dispatch({
                        type: Types.Login,
                        payload: {
                            firstLogin,
                            metamaskInstalled: meta,
                            user: null,
                            wallet: { address },
                            info: userInfo
                        },
                    });
                    return;
                }
            }
        } catch (error)
        {
            console.log('initialize', error.message);
        }
        dispatch({
            type: Types.Initial,
            payload: {
                firstLogin: false,
                metamaskInstalled: window?.ethereum,
                isAuthenticated: false,
                user: null,
                wallet: null,
                info: null
            },
        });
    }

    const initWithoutCreateNewAccount = async () =>
    {
        try
        {
            let userInfo: UserInfoResponse | null = null;
            if (meta)
            {
                sdk.client = client;
                const address = await sdk.account();
                if (address?.length)
                {
                    const signer = await getSigner();
                    sdk.signer = signer;
                    fetchAccountBalance(address);
                    dispatch({
                        type: Types.Initial,
                        payload: {
                            firstLogin: false,
                            metamaskInstalled: meta,
                            isAuthenticated: address?.length,
                            user: null,
                            wallet: { address },
                            info: userInfo
                        },
                    });
                    return;
                }
            }
        } catch (error)
        {
            console.log('initialize', error.message);
        }
        dispatch({
            type: Types.Initial,
            payload: {
                metamaskInstalled: window?.ethereum,
                firstLogin: false,
                isAuthenticated: false,
                user: null,
                wallet: null,
                info: null
            },
        });
    }

    const fetchAccountBalance = async (wallet: string) =>
    {
        const bal = await sdk.getBalance(wallet);
        setBalances(bal);
    };

    const logout = async () =>
    {
        await sdk.disconnect(state.wallet.address);
        dispatch({
            type: Types.Logout
        })
    };

    const login = async () =>
    {
        const accounts = await sdk.connect();
        if (accounts?.length)
        {
            const address = accounts[0];
            let userInfo = await fetchUserInfo(address);
            const firstLogin = typeof userInfo === undefined;
            if (firstLogin)
            {
                userInfo = await createUser({
                    email: '',
                    walletAddress: address,
                    avatarUrl: '', about: '', fullName: ''
                });
            }
            const balance = await sdk.getBalance(address);
            setBalances(balance);
            dispatch({
                type: Types.Login,
                payload: {
                    metamaskInstalled: meta,
                    user: null,
                    wallet: { address },
                    info: userInfo,
                    firstLogin
                },
            });
        }
    }

    const sendTransaction = async (toWallet: string, amount: number, onDonateSuccess: (trans: TransasctionHistory) => void) =>
    {
        try
        {
            if (state?.wallet)
            {
                const transHistory: TransasctionHistory = {
                    amount,
                    sourceId: 0,
                    senderWallet: "",
                    receiver: 0
                }

                await sdk.sendTransaction(toWallet, amount);
                transHistory.senderWallet = state.wallet.address;
                onDonateSuccess(transHistory);
            }
        } catch (error)
        {
            console.log('sendTransaction', error);
        }
    };

    const fetchUserInfoById = async (id: number): Promise<UserInfoResponse | null> =>
    {
        const res = await userSvc.infoById(id);
        if (res?.status === 200)
        {
            const uInfo = { ...res.data as UserInfoResponse };
            const { about } = uInfo;
            try
            {
                uInfo.detailAbout = JSON.parse(about);
            } catch (error)
            {
                uInfo.detailAbout = { content: about };
            }
            return uInfo;
        };
        return null;
    };

    const createUser = async (obj: AddUserInfoDto): Promise<UserInfoResponse | null> =>
    {
        const res = await userSvc.add(obj);
        if (res?.status === 200) return res.data;
        return null;
    };

    const fetchUserInfo = async (walletAddress: string): Promise<UserInfoResponse | null> =>
    {
        const res = await userSvc.info(walletAddress);

        if (res?.status === 200)
        {
            const uInfo = { ...res.data as UserInfoResponse };
            const { about } = uInfo;
            try
            {
                uInfo.detailAbout = JSON.parse(about);
            } catch (error)
            {
                uInfo.detailAbout = { content: about };
            }
            return uInfo;
        }
        return null;
    };

    const updateProfile = (newInfo?: UserInfoResponse) =>
    {
        const uInfo = { ...newInfo };
        const { about } = uInfo;
        try
        {
            uInfo.detailAbout = JSON.parse(about);
        } catch (error)
        {
            uInfo.detailAbout = { content: about };
        }
        dispatch({
            type: Types.UpdateProfile, payload: {
                firstLogin: false,
                info: uInfo ? uInfo : state.info
            },
        });
    };

    const getSigner = async () =>
    {
        if (meta)
        {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            return signer;
        }
    }

    const requestTokenFromFaucet = async () =>
    {
        if (state.wallet?.address)
        {
            const res = await faucetSvc.getTokens(state.wallet.address, sdk.chainId);
            await fetchAccountBalance(state.wallet.address);
            return res;
        }
    }

    return <ChainContext.Provider value={{
        ...state,
        balances,
        loadingBalance,

        fetchAccountBalance,
        logout,
        login,
        sendTransaction,
        fetchUserInfoById,
        updateProfile,
        requestTokenFromFaucet
    }}>

        {children}
    </ChainContext.Provider>
};

export { ChainContext, ChainProvider }