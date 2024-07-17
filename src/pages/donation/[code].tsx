import { createNetworkConfig, SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SuiAuthProvider } from "src/contexts/SuiAuthContext";
import Layout from "src/layouts";
import { Container, Stack, styled, useTheme } from "@mui/material";
import Page from '../../components/Page';
import { FormConfig } from "src/components/form/FormConfig";
import { getFullnodeUrl } from '@mysten/sui.js/client';
import { FormConfigContext, FormConfigProvider } from "src/contexts/FormConfigContext";
import useSettings from "src/hooks/useSettings";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { TempConfig } from '../../contexts/FormConfigContext';
import LoadingScreen from "src/components/LoadingScreen";
import Page404 from "../404";

const RootStyle = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(10),
}));

Donation.getLayout = function getLayout(page: React.ReactElement)
{
    return <Layout variant="logoOnly">{page}</Layout>;
};

const DonateComponent: React.FC = () =>
{
    const { _fetchConfigByCode } = useContext(FormConfigContext);
    const { query: { code } } = useRouter();
    const isInit = useRef(false);
    const [loading, setLoading] = useState(true);
    const [formConfig, setFormConfig] = useState<TempConfig>();

    const [formResult, setFormResult] = useState();

    useEffect(() =>
    {
        if (!isInit.current && code)
        {
            initForm();
        }
        return () =>
        {
            isInit.current = true;
        }
    }, [code]);

    const initForm = async () =>
    {
        if (code && typeof code === 'string')
        {
            const res = await _fetchConfigByCode(code);
            console.log(res.data);
            if (res?.config) setFormConfig(JSON.parse(res.config));

            setLoading(false);
        }
    }
    return <>
        {
            loading && < LoadingScreen />
        }

        {(!loading && !formConfig) && <Page404 />}
        {(!loading && formConfig) &&
            <>
            </>
        }
    </>
}

export default function Donation()
{
    // Config options for the networks you want to connect to
    const { networkConfig } = createNetworkConfig({
        localnet: { url: getFullnodeUrl('localnet') },
        mainnet: { url: getFullnodeUrl('mainnet') },
        devnet: { url: getFullnodeUrl('devnet') }
    });

    const queryClient = new QueryClient();
    const { themeStretch } = useSettings();
    return (
        <Page title="Donate">
            <QueryClientProvider client={queryClient}>
                <SuiClientProvider defaultNetwork='devnet' networks={networkConfig}>
                    <WalletProvider autoConnect>
                        <SuiAuthProvider>
                            <FormConfigProvider>
                                <RootStyle>
                                    <Container maxWidth={themeStretch ? false : 'lg'} sx={{
                                        textAlign: 'center',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }} >
                                        <DonateComponent />
                                    </Container>
                                </RootStyle>
                            </FormConfigProvider>
                        </SuiAuthProvider>
                    </WalletProvider>
                </SuiClientProvider>
            </QueryClientProvider>
        </Page >
    )
}
