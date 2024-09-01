import { Button, CardHeader, Container, OutlinedInput, Stack, styled, TextField, ToggleButton, ToggleButtonGroup, Typography, Card, CardContent, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, Avatar, alpha, Grid } from '@mui/material';
import Page from '../../components/Page';
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { FormConfigContext, FormConfigProvider, TempConfig } from '../../contexts/FormConfigContext';
import Page404 from "../404";
import { LoadingButton } from "@mui/lab";
import React from "react";
import Iconify from "../../components/Iconify";
import LoadingScreen from "../../components/LoadingScreen";
import useSettings from "../../hooks/useSettings";
import Layout from "../../layouts";
import { UserInfoResponse } from "src/@types/dto/user-dto";
import SourceServices from "src/services/SourceServices";
import TransactionServices from "src/services/TransactionServices";
import { TransitionProps } from "@mui/material/transitions";
import createAvatar from "src/utils/createAvatar";
import { UserSocialInfo } from "src/@types/sui-user";
import { _SOCIALS } from "src/constants/social";
import { _appTransactions } from "src/_mock";
import Label from "src/components/Label";
import { DisplayLogo } from 'src/components/DisplayLogo';
import { ChainProvider } from 'src/contexts/ChainContext';
import useChainAuth from 'src/hooks/useChainAuth';
import { MAIN_CHAIN } from 'src/config';
import { MetamaskConnectToWallet } from 'src/components/MetamaskConnectToWallet';
import useResponsive from 'src/hooks/useResponsive';
import { useSnackbar } from 'notistack';

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

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
)
{
    return <Slide direction="up" ref={ref} {...props} />;
});

const DonateComponent: React.FC = () =>
{
    const {
        isAuthenticated,
        sendTransaction,
        requestTokenFromFaucet,
        balances,
        fetchUserInfoById,
        loadingBalance
    } = useChainAuth();
    const transSvc = new TransactionServices();
    const sourceSvc = new SourceServices();
    const { push } = useRouter();

    const { _fetchConfigByCode } = useContext(FormConfigContext);
    const { query: { code, utm_source } } = useRouter();
    const isInit = useRef(false);
    const [loading, setLoading] = useState(true);
    const [formConfig, setFormConfig] = useState<TempConfig>();
    const { enqueueSnackbar } = useSnackbar();

    const [formResult, setFormResult] = useState({});
    const [loadingRequestToken, setLoadingRequestToken] = useState(false);
    const [linkCreator, setLinkCreator] = useState<UserInfoResponse>();
    const [source, setSource] = useState<{
        linkId: number,
        utmSource: string | null,
    }>({
        linkId: -2,
        utmSource: (utm_source as string) || null
    });
    const isDesktop = useResponsive('up', 'md');
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [loadingSendSui, setLoadingSendSui] = useState(false);
    const [message, setMessage] = useState<{
        type?: 'success' | 'error',
        content?: string
    } | null>();

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
                setSource({
                    linkId: res.data.id,
                    utmSource: utm_source && typeof utm_source === 'string' ? utm_source : null
                })
                setFormConfig(res.data.config);
                const infoRes = await fetchUserInfoById(res.data.userId);
                if (infoRes) setLinkCreator(infoRes);
            }
            setLoading(false);
        }
    }

    const handleRequestToken = async () =>
    {
        setLoadingRequestToken(true);
        const res = await requestTokenFromFaucet();
        console.log(res);
        enqueueSnackbar(res.data.data);
        setLoadingRequestToken(false);
    }

    const doTip = () =>
    {
        setOpenConfirmDialog(false);
        if (linkCreator?.id)
        {
            setLoadingSendSui(true);
            sendTransaction(linkCreator.walletAddress, formResult.amount, async (trans) =>
            {
                try
                {
                    const srcInfo = await sourceSvc.add(source);
                    const transaction = {
                        ...trans, ...{
                            sourceId: srcInfo?.id,
                            receiver: linkCreator.id,
                            amount: parseInt(formResult.amount),
                            name: formResult.name,
                            note: formResult.note
                        }
                    };
                    const addTranRes = await transSvc.add(transaction);
                    setMessage({
                        type: 'success',
                        content: 'Donated successful !'
                    });
                    setTimeout(() =>
                    {
                        setMessage(null);
                        push('/thank-to-donate');
                        localStorage.setItem('donate_amount', formResult.amount);
                    }, 1000);

                } catch (error)
                {
                    setMessage({
                        type: 'error',
                        content: error
                    });
                }
                setTimeout(() => { setMessage(null); }, 3000);
                setLoadingSendSui(false);
            });
        }
    };
    const aava = createAvatar(linkCreator?.avatarUrl || linkCreator?.fullName || linkCreator?.walletAddress);
    const socials: UserSocialInfo[] = [{
        name: 'facebook',
        link: ''
    }, {
        name: 'twitter',
        link: ''
    }];
    const recentDonations = _appTransactions.slice(0, 5);
    return <>
        {
            loading && < LoadingScreen />
        }

        {(!loading && (!formConfig)) && <Page404 />}
        {(!loading && formConfig) &&
            <>
                <Grid container direction={'row'} spacing={2}>
                    <Grid item md={6} xs={12}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent sx={{ height: '100%' }}>
                                <Stack spacing={4} alignItems={'center'}>
                                    <Avatar color={aava.color} sx={{ width: 80, height: 80, bgcolor: (theme) => alpha(theme.palette[aava.color].main, 1) }}>
                                        <Typography variant="h2">{aava.name}</Typography>
                                    </Avatar>
                                    <TextField
                                        color='info'
                                        label='Wallet'
                                        fullWidth
                                        value={linkCreator?.walletAddress}
                                        disabled
                                    />
                                    <TextField
                                        color='info'
                                        multiline
                                        label='About'
                                        fullWidth
                                        value={linkCreator?.detailAbout?.content}
                                        disabled
                                    />
                                    {isDesktop && <Card>
                                        <CardHeader title={
                                            <Stack justifyContent={'start'} alignContent={'start'}>
                                                <Typography variant="h6" textAlign={'left'}>Recent donations</Typography>
                                            </Stack>
                                        } />
                                        <CardContent>
                                            <Stack spacing={2} width={'100%'}>
                                                {recentDonations.map((r) =>
                                                {
                                                    const dAva = createAvatar(r.name);
                                                    return <Card variant="outlined" sx={{ bgcolor: (theme) => theme.palette.background.neutral }}>
                                                        <CardContent>
                                                            <Stack direction={'row'} justifyContent={'space-between'} alignContent={'baseline'} spacing={4}>
                                                                <Stack spacing={2} direction={'row'}>
                                                                    <Avatar
                                                                        sx={{
                                                                            width: 42, height: 42,
                                                                            color: (theme) => theme.palette.text.primary,
                                                                            bgcolor: (theme) => alpha(theme.palette[dAva.color].main, 1)
                                                                        }}>
                                                                        <Typography variant="h6">{dAva.name}</Typography>
                                                                    </Avatar>
                                                                    <Stack direction={'column'} justifyContent={'start'} alignContent={'start'} textAlign={'left'}>
                                                                        <Typography variant="body1">{r.name}</Typography>
                                                                        <Typography variant="caption">{r.note}</Typography>
                                                                    </Stack>
                                                                </Stack>
                                                                <Label height={'auto'} color="success" sx={{ p: 2, minWidth: 40, width: 75, textAlign: 'right' }}>
                                                                    <Typography variant="h6">{r.amount}</Typography>
                                                                    <DisplayLogo width={28} height={28} />
                                                                </Label>
                                                            </Stack>
                                                        </CardContent>
                                                    </Card>
                                                }
                                                )}
                                            </Stack>
                                        </CardContent>
                                    </Card>}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item container direction={'column'} md={6} xs={12} spacing={2}>
                        <Grid width={'100%'} item height={'fit-content'}>
                            <Card>
                                <CardContent>
                                    <Stack alignSelf={'center'} alignItems={'center'}>
                                        <Typography variant="h4">{linkCreator?.fullName}</Typography>
                                        <Typography variant="body1" sx={{ opacity: 0.7 }}>351 supporter</Typography>
                                    </Stack>
                                    <Stack mt={1} direction={'row'} alignSelf={'center'} alignItems={'center'} justifyContent={'center'} spacing={3}>
                                        {socials.map(s =>
                                        {
                                            const si = _SOCIALS.find(si => si.name === s.name);
                                            return <Button variant="contained" sx={{ bgcolor: si?.color }}>
                                                <Iconify icon={si.icon} width={48} height={48} />
                                            </Button>
                                        })}
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item>
                            <Card>
                                <CardContent>
                                    <Stack spacing={2} alignSelf={'center'} alignItems={'center'}>
                                        <Stack>
                                            <Typography variant="h4">{formConfig.title}</Typography>
                                            <Typography variant="body1">{formConfig.subtitles}</Typography>
                                        </Stack>
                                        <Typography variant='h6'>Donation amount</Typography>
                                        <Stack
                                            direction={'row'}
                                            justifyContent={'center'}
                                            alignItems={'center'}
                                            bgcolor={(theme) => theme.palette.background.neutral}
                                            borderRadius={'0.25rem'}
                                            padding={3}
                                            gap={2}
                                            width={'100%'}
                                        >
                                            <DisplayLogo width={40} height={40} />
                                            <Iconify icon={'eva:close-fill'} width={16} height={16} />
                                            {isDesktop ? formConfig.amounts.map((a: any, index: number) => (
                                                <ToggleButtonGroup
                                                    color="primary"
                                                    exclusive
                                                    onChange={(e, val) => { setFormResult({ ...formResult, ...{ amount: val } }); }}
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
                                                                        border: 0
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
                                                                placeholder={`Any ${MAIN_CHAIN}`}
                                                                sx={{ width: 120, borderRadius: 1 }}
                                                                onChange={(e) => { setFormResult({ ...formResult, ...{ amount: e.target.value } }) }}
                                                            />
                                                        )
                                                    }
                                                </ToggleButtonGroup>
                                            )) : <OutlinedInput
                                                type='number'
                                                size='small'
                                                placeholder={`Any ${MAIN_CHAIN}`}
                                                sx={{ width: 120, borderRadius: 1 }}
                                                onChange={(e) => { setFormResult({ ...formResult, ...{ amount: e.target.value } }) }}
                                            />}
                                        </Stack>
                                        <TextField
                                            color='info'
                                            label='Name'
                                            fullWidth
                                            value={formResult.name}
                                            onChange={(e) =>
                                            {
                                                setFormResult({ ...formResult, ...{ name: e.target.value } });
                                            }}
                                        />
                                        <TextField
                                            color='info'
                                            rows={3}
                                            placeholder='Say something nice...(optional)'
                                            value={formResult.note}
                                            fullWidth
                                            multiline
                                            onChange={(e) =>
                                            {
                                                setFormResult({ ...formResult, ...{ note: e.target.value } });
                                            }}
                                        />
                                        {
                                            isAuthenticated &&
                                            <Stack spacing={2}>
                                                <Alert severity="success" color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Stack justifyContent={'center'} justifyItems={'center'} alignItems={'center'} direction={'row'}>
                                                        {!loadingBalance ? <Typography variant="h6">Your balance : {balances}</Typography> : <Typography variant="h6">Refreshing balance ...</Typography>}
                                                        <DisplayLogo width={28} height={28} />
                                                    </Stack>
                                                </Alert>
                                                <Stack direction={'row'} gap={2} justifyItems={'center'}>
                                                    <LoadingButton variant="contained"
                                                        loading={loadingSendSui}
                                                        disabled={!(formResult.amount && formResult.name && formResult.amount <= balances)}
                                                        sx={[{ flex: '1', bgcolor: '#F1F9FEFF', fontSize: '1rem', color: '#4ba2ff', borderRadius: '22px', boxShadow: '0 8px 16px 0 #60adff3d' }, {
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
                                                        onClick={doTip}>
                                                        <Stack direction={'row'} justifyContent={'center'} alignItems={'center'} gap={1}>
                                                            <Iconify icon={'tabler:heart-filled'} color={'inherit'} />
                                                            <span>Donate</span>
                                                        </Stack>
                                                    </LoadingButton>
                                                    <LoadingButton
                                                        loading={loadingRequestToken}
                                                        title={`Request ${MAIN_CHAIN} From Faucet`}
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
                                                        onClick={handleRequestToken}>
                                                        <span>{isDesktop && `Not enough ${MAIN_CHAIN} ?`} Buy {MAIN_CHAIN} here</span>
                                                    </LoadingButton>

                                                </Stack>
                                                {
                                                    message && <Alert severity={message.type} color={message.type} sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Stack justifyContent={'center'} justifyItems={'center'} alignItems={'center'} direction={'row'}>
                                                            <Typography variant="h6">{message.content}</Typography>
                                                        </Stack>
                                                    </Alert>
                                                }
                                            </Stack>
                                        }
                                        {
                                            !isAuthenticated &&
                                            <MetamaskConnectToWallet />
                                        }
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </>
        }
    </>
}

export default function Donation()
{
    // Config options for the networks you want to connect to

    const { themeStretch } = useSettings();
    return (
        <Page title="Donate">
            <ChainProvider createnewAccount={false}>
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
            </ChainProvider>
        </Page >
    )
}
