import { NetworkName } from "@polymedia/suits";
import { ReactNode, createContext, useEffect, useReducer, useRef, useState } from "react";
import { ActionMap } from "src/@types/auth";
import SuiSDK, { AccountData } from "src/sui/sdk";

type SuiAuthState = {
    isInitialized: boolean,
    isAuthenticated: boolean,
    user: AccountData | null,
}

interface SuiAuthContextType extends SuiAuthState
{
    NETWORK: NetworkName,
    balances: number,

    login: (provider: 'Google' | 'Facebook' | 'Twitch') => Promise<void>,
    fetchAccountBalance: (acc: AccountData) => Promise<void>,
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
    };
    [Types.Login]: {
        user: AccountData;
    };
    [Types.Logout]: undefined;
}

type SuiAuthActions = ActionMap<SuiAuthPayload>[keyof ActionMap<SuiAuthPayload>];

const initialState: SuiAuthState = {
    isInitialized: false,
    isAuthenticated: false,
    user: null,
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
            };
        case Types.Login:
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
            };
        case Types.Logout:
            return {
                ...state,
                isAuthenticated: false,
                user: null,
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
    const sdk = new SuiSDK();
    const [balances, setBalances] = useState<number>(0); // Map<Sui address, SUI balance>
    const isInit = useRef(false);

    useEffect(() =>
    {
        if (!isInit.current)
        {
            initialize();
        }
        return () =>
        {
            isInit.current = true;
        }
    }, []);

    const initialize = async () =>
    {
        try
        {
            let account = await sdk.completeZkLogin();
            if (!account) account = await sdk.loadAccount();

            if (account)
            {
                await fetchAccountBalance(account);

                dispatch({
                    type: Types.Initial,
                    payload: {
                        isAuthenticated: account !== null,
                        user: account,
                    },
                });
                return;
            }
            dispatch({
                type: Types.Initial,
                payload: {
                    isAuthenticated: false,
                    user: null,
                },
            });

        } catch (error)
        {
            console.log('initialize', error.message);
            dispatch({
                type: Types.Initial,
                payload: {
                    isAuthenticated: false,
                    user: null,
                },
            });
        }
    };

    const fetchAccountBalance = async (account: AccountData) =>
    {
        const res = await sdk.fetchBalances(account);

        setBalances(res?.get(account.userAddr) || 0);
    }

    const login = async (provider: 'Google' | 'Facebook' | 'Twitch') =>
    {
        sdk.beginZkLogin(provider);

    };

    const logout = async () =>
    {
        sdk.clearState();
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