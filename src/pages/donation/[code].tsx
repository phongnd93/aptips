import { ConnectModal, createNetworkConfig, SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SuiAuthProvider } from "src/contexts/SuiAuthContext";
import Layout from "src/layouts";
import { Button, CardHeader, Container, OutlinedInput, Stack, styled, TextField, ToggleButton, ToggleButtonGroup, Typography, Card, CardContent, Alert } from "@mui/material";
import Page from '../../components/Page';
import { getFullnodeUrl } from '@mysten/sui.js/client';
import { FormConfigContext, FormConfigProvider } from "src/contexts/FormConfigContext";
import useSettings from "src/hooks/useSettings";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { TempConfig } from '../../contexts/FormConfigContext';
import LoadingScreen from "src/components/LoadingScreen";
import Page404 from "../404";
import Iconify from "src/components/Iconify";
import SvgIconStyle from "src/components/SvgIconStyle";
import useSuiAuth from "src/hooks/useSuiAuth";
import '@mysten/dapp-kit/dist/index.css';
import { LoadingButton } from "@mui/lab";
import { requestSuiFromFaucet } from "@polymedia/suits";

const RootStyle = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(10),
}));

const AmountToggleButton = styled(ToggleButton)(({ theme }) => ({
    "&.Mui-selected, &.Mui-selected:hover": {
        color: "white",
        backgroundColor: theme.palette.primary.main
    }
}));

Donation.getLayout = function getLayout(page: React.ReactElement)
{
    return <Layout variant="logoOnly">{page}</Layout>;
};

const DonateComponent: React.FC = () =>
{
    const { isAuthenticated,
        sendTransaction,
        info,
        user,
        wallet,
        fetchAccountBalance,
        NETWORK,
        balances,
        fetchUserInfoById } = useSuiAuth();
    const { _fetchConfigByCode } = useContext(FormConfigContext);
    const { query: { code } } = useRouter();
    const isInit = useRef(false);
    const [loading, setLoading] = useState(true);
    const [formConfig, setFormConfig] = useState<TempConfig>();

    const [formResult, setFormResult] = useState({});
    const [open, setOpen] = useState(false);
    const [loadingBuySui, setLoadingBuySui] = useState(false);
    const [linkCreator, setLinkCreator] = useState();

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

            if (res?.data?.config)
            {
                setFormConfig(res.data.config);
                const infoRes = await fetchUserInfoById(res.data.userId);
                console.log(infoRes);
                if (infoRes) setLinkCreator(infoRes);
            }

            setLoading(false);
        }
    }

    const handleRequestSui = async () =>
    {
        if (user || wallet)
        {
            setLoadingBuySui(true);
            await requestSuiFromFaucet(NETWORK, user?.userAddr || wallet?.address);
            setTimeout(async () =>
            {
                await fetchAccountBalance(user?.userAddr || wallet?.address);
                setLoadingBuySui(false);
            }, 3000);
        }
    };

    const handleSendSui = async () =>
    {

    };

    return <>
        {
            loading && < LoadingScreen />
        }

        {(!loading && !formConfig) && <Page404 />}
        {(!loading && formConfig) &&
            <>
                <Stack direction={'row'} spacing={4}>
                    <Stack flex={1}>
                        <Card sx={{ height: '100%' }}>
                            <CardHeader title={`About ${linkCreator?.fullName}`} />
                            <CardContent sx={{ height: '100%' }}>
                                {linkCreator?.about}
                            </CardContent>
                        </Card>
                    </Stack>
                    <Stack flex={1}>
                        <Card>
                            <CardContent>
                                <Stack spacing={2} alignSelf={'center'} alignItems={'center'}>
                                    <Typography variant="h4">{formConfig.title}</Typography>
                                    <Typography variant="body1">{formConfig.subtitles}</Typography>
                                    <Typography variant='h6'>Donation amount</Typography>
                                    <Stack
                                        direction={'row'}
                                        justifyContent={'center'}
                                        alignItems={'center'}
                                        bgcolor={'#D0F2FF'}
                                        borderRadius={'0.25rem'}
                                        padding={3}
                                        gap={2}
                                        width={'100%'}
                                    >
                                        <SvgIconStyle src={`/icons/ic_sui.svg`} width={40} height={40} />
                                        <Iconify icon={'eva:close-fill'} width={16} height={16} />
                                        {formConfig.amounts.map((a: any, index: number) => (
                                            <ToggleButtonGroup color="primary"
                                                exclusive
                                                onChange={(e, val) => { setFormResult({ ...formResult, ...{ amount: val } }) }}
                                                aria-label="Platform"
                                                value={formResult.amount}>
                                                {(a && typeof a === 'number')
                                                    ? (
                                                        <AmountToggleButton
                                                            className='form-donation-toggle-button'
                                                            sx={[
                                                                {
                                                                    borderRadius: '50%',
                                                                    width: 40,
                                                                    height: 40,
                                                                    backgroundColor: 'white',
                                                                    color: 'deepskyblue',
                                                                }
                                                            ]}
                                                            value={a}
                                                        >
                                                            {a}
                                                        </AmountToggleButton>
                                                    )
                                                    : (
                                                        <OutlinedInput
                                                            type='number'
                                                            size='small'
                                                            placeholder='Any Sui'
                                                            sx={{ width: 120, bgcolor: 'white', borderRadius: 1 }}
                                                            onChange={(e) => { setFormResult({ ...formResult, ...{ amount: e.target.value } }) }}
                                                        />
                                                    )
                                                }
                                            </ToggleButtonGroup>
                                        ))}
                                    </Stack>
                                    <TextField
                                        color='info'
                                        label='Name'
                                        fullWidth
                                    />
                                    <TextField
                                        color='info'
                                        rows={3}
                                        placeholder='Say something nice...(optional)'
                                        fullWidth
                                        multiline
                                    />
                                    {
                                        isAuthenticated &&
                                        <Stack spacing={2}>
                                            <Alert icon={<Iconify icon={'token-branded:sui'} width={24} height={24} />} severity="success">
                                                <Typography variant="h6">Your balance : {balances}</Typography>
                                            </Alert>
                                            <Stack direction={'row'} gap={2}>
                                                <LoadingButton variant="contained"
                                                    sx={[{ bgcolor: '#F1F9FEFF', fontSize: '1rem', color: '#4ba2ff', borderRadius: '22px', boxShadow: '0 8px 16px 0 #60adff3d' }, {
                                                        '&:hover': {
                                                            color: '#0C476FFF',
                                                            background: '#E9F5FDFF'
                                                        }
                                                    }, {
                                                        '&:hover:active': {
                                                            color: "#0C476FFF",
                                                            background: "#D1EAFAFF",
                                                        }
                                                    }]}
                                                    onClick={() =>
                                                    {
                                                        // sendTransaction()
                                                    }}>
                                                    <Stack direction={'row'} justifyContent={'center'} alignItems={'center'} gap={2}>
                                                        <Iconify icon={'tabler:heart-filled'} color={'#4ba2ff'} />
                                                        <span>Donate</span>
                                                    </Stack>
                                                </LoadingButton>
                                                <LoadingButton
                                                    loading={loadingBuySui}
                                                    title='Request Sui From Faucet'
                                                    variant="contained"
                                                    sx={[{ bgcolor: '#ffc107FF', fontSize: '1rem', color: (theme) => theme.palette.warning.lighter, borderRadius: '22px', boxShadow: '0 8px 16px 0 #ffc10780' }, {
                                                        '&:hover': {
                                                            color: '#ffc107FF',
                                                            background: '#ffc10780'
                                                        }
                                                    }, {
                                                        '&:hover:active': {
                                                            color: "#ffc107FF",
                                                            background: "#ffc10780",
                                                        }
                                                    }]}
                                                    onClick={handleRequestSui}>
                                                    <span>Not enough SUI ? Buy SUI here</span>
                                                </LoadingButton>
                                            </Stack>
                                        </Stack>
                                    }
                                    {
                                        !isAuthenticated &&
                                        <Button
                                            fullWidth
                                            size="large"
                                            variant="contained"
                                            sx={[{ bgcolor: '#F1F9FEFF', fontSize: '1rem', color: '#4ba2ff', borderRadius: '22px', boxShadow: '0 8px 16px 0 #60adff3d' }, {
                                                '&:hover': {
                                                    color: '#0C476FFF',
                                                    background: '#E9F5FDFF'
                                                }
                                            }, {
                                                '&:hover:active': {
                                                    color: "#0C476FFF",
                                                    background: "#D1EAFAFF",
                                                }
                                            }]}
                                            onClick={() => { setOpen(true); }}
                                        >
                                            <Stack direction={'row'} spacing={1} alignContent={"baseline"} alignItems={"center"}>
                                                <Iconify icon={'token-branded:sui'} width={32} height={32} />
                                                <span>Connect to wallet</span>
                                            </Stack>
                                        </Button>
                                    }
                                </Stack>
                            </CardContent>
                        </Card>
                    </Stack>

                </Stack>
                <ConnectModal
                    trigger={
                        <></>
                    }
                    open={open}
                    onOpenChange={(isOpen) => setOpen(isOpen)}
                />
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
