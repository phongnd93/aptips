import { createContext, FC, ReactNode, useEffect, useLayoutEffect, useReducer, useState } from "react";
import { AccountInfo, InputTransactionData, useWallet, WalletInfo } from "@aptos-labs/wallet-adapter-react";
import { Aptos, APTOS_COIN, AptosConfig } from "@aptos-labs/ts-sdk";
import { AddUserInfoDto, UserInfoResponse } from "src/@types/dto/user-dto";
import { ActionMap } from "src/@types/auth";
import { TransasctionHistory } from "src/@types/transaction";
import UserServices from "src/services/UserServices";

type AuthState = {
    isInitialized: boolean,
    isAuthenticated: boolean,
    firstLogin: boolean,
    user: AccountInfo | null,
    wallet: WalletInfo | null,
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
        user: AccountInfo | null;
        wallet: WalletInfo | null;
        info: UserInfoResponse | null;
    };
    [Types.Login]: {
        firstLogin: boolean;
        user: AccountInfo | null;
        wallet: WalletInfo | null;
        info: UserInfoResponse | null;
    };
    [Types.UpdateProfile]: {
        firstLogin: boolean;
        info: UserInfoResponse | null;
    };
    [Types.Logout]: undefined;
}

type AuthActions = ActionMap<AuthPayload>[keyof ActionMap<AuthPayload>];

const initialState: AuthState = {
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
                isInitialized: true,
                firstLogin: action.payload.firstLogin,
                user: action.payload.user,
                wallet: action.payload.wallet,
                info: action.payload.info
            };
        case Types.Login:
            return {
                ...state,
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

interface AptosContextType extends AuthState
{
    balances: number,
    loadingBalance: boolean,

    fetchAccountBalance: (walletAddress: string) => Promise<void>,
    logout: () => Promise<void>,
    sendTransaction: (toWallet: string, amout: number, onDonateSuccess: (trans: TransasctionHistory) => void) => Promise<void>,
    fetchUserInfoById: (id: number) => Promise<UserInfoResponse | null>,
    updateProfile: (info?: UserInfoResponse) => void
    // getRevenue: () => Promise<RevenueResponseDTO | null>,
    // getTransactions: () => Promise<Transaction[] | null>,
    // getTopDonators: () => Promise<Donator[] | null>,
}

const AptosContext = createContext<AptosContextType | null>(null);

type AptosContextProps = {
    children: ReactNode,
    createnewAccount: boolean
};
const AptosProvider: FC<AptosContextProps> = ({ children, createnewAccount }: AptosContextProps) =>
{
    const [state, dispatch] = useReducer(AuthReducer, initialState);
    const [balances, setBalances] = useState<number>(0);
    const [loadingBalance, setLoadingBalance] = useState(false);
    const userSvc = new UserServices();
    const aptosWallet = useWallet();
    const { account, wallet, connected, network, disconnect, signAndSubmitTransaction, wallets, isLoading } = useWallet();
    const client = new Aptos(new AptosConfig({
        network: network?.name
    }));
    useEffect(() =>
    {
        if (wallets?.length > 0 && !isLoading)
        {
            if (createnewAccount)
                initialize();
            else initWithoutCreateNewAccount();
        }

    }, [connected, wallets]);

    const initialize = async () =>
    {
        let firstLogin = false;
        try
        {

            let userInfo: UserInfoResponse | null = null;
            if (connected && account?.address)
            {
                const info = await fetchUserInfo(account.address);
                fetchAccountBalance(account.address);
                if (info) userInfo = info; else
                {
                    firstLogin = true;
                    userInfo = await createUser({
                        email: '',
                        walletAddress: account.address,
                        avatarUrl: '', about: '', fullName: ''
                    });
                }
                dispatch({
                    type: Types.Initial,
                    payload: {
                        firstLogin,
                        isAuthenticated: account !== null && userInfo !== null,
                        user: account,
                        wallet: wallet,
                        info: userInfo
                    },
                });
                return;

            }
        } catch (error)
        {
            console.log('initialize', error.message);
        }
        console.log(aptosWallet);
        dispatch({
            type: Types.Initial,
            payload: {
                firstLogin: false,
                isAuthenticated: false,
                user: null,
                wallet: null,
                info: null
            },
        });
    }

    const initWithoutCreateNewAccount = () =>
    {
        try
        {
            let userInfo: UserInfoResponse | null = null;
            if (account)
            {
                fetchAccountBalance(account.address);

                dispatch({
                    type: Types.Initial,
                    payload: {
                        firstLogin: false,
                        isAuthenticated: account !== null,
                        user: account,
                        wallet: wallet,
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
        setLoadingBalance(true);
        const res = await client.getAccountResource({ accountAddress: wallet, resourceType: "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>" });
        const val = res?.coin?.value;
        setBalances(parseInt(val) / Math.pow(10, 8));
        setLoadingBalance(false);
    };

    const logout = async () =>
    {
        disconnect();
    };

    const sendTransaction = async (toWallet: string, amount: number, onDonateSuccess: (trans: TransasctionHistory) => void) =>
    {
        try
        {
            if (account)
            {
                const transHistory: TransasctionHistory = {
                    amount,
                    sourceId: 0,
                    senderWallet: "",
                    receiver: 0
                }

                const transaction: InputTransactionData = {
                    data: {
                        function: '0x1::coin::transfer',
                        typeArguments: [APTOS_COIN],
                        functionArguments: [toWallet, amount * Math.pow(10, 8)],
                    },
                };
                const txn = await signAndSubmitTransaction(transaction);
                await client.waitForTransaction({
                    transactionHash: txn.hash,
                })
                transHistory.senderWallet = account.address;
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
        if (res?.status === 200) return res.data;
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
        })
    }


    return <AptosContext.Provider value={{
        ...state,
        balances,
        loadingBalance,

        fetchAccountBalance,
        logout,
        sendTransaction,
        fetchUserInfoById,
        updateProfile
    }}>

        {children}
    </AptosContext.Provider>
}

export { AptosContext, AptosProvider };