import { Button, CardHeader, Container, OutlinedInput, Stack, styled, TextField, ToggleButton, ToggleButtonGroup, Typography, Card, CardContent, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, Avatar, alpha } from '@mui/material';
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
import useAptos from "src/hooks/useAptos";
import { UserInfoResponse } from "src/@types/dto/user-dto";
import SourceServices from "src/services/SourceServices";
import TransactionServices from "src/services/TransactionServices";
import { TransitionProps } from "@mui/material/transitions";
import createAvatar from "src/utils/createAvatar";
import { UserSocialInfo } from "src/@types/sui-user";
import { _SOCIALS } from "src/constants/social";
import { _appTransactions } from "src/_mock";
import Label from "src/components/Label";
import { AptosProvider } from "src/contexts/aptos/AptosContext";
import AptosLoginForm from 'src/sections/auth/login/AptosLoginForm';
import { address } from '../../_mock/wallet';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

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
        user,
        wallet,
        fetchAccountBalance,
        balances,
        fetchUserInfoById,
        loadingBalance
    } = useAptos();
    const { account } = useWallet();
    const transSvc = new TransactionServices();
    const sourceSvc = new SourceServices();
    const { push } = useRouter();

    const { _fetchConfigByCode } = useContext(FormConfigContext);
    const { query: { code, utm_source } } = useRouter();
    const isInit = useRef(false);
    const [loading, setLoading] = useState(true);
    const [formConfig, setFormConfig] = useState<TempConfig>();

    const [formResult, setFormResult] = useState({});
    const [open, setOpen] = useState(false);
    const [loadingBuySui, setLoadingBuySui] = useState(false);
    const [linkCreator, setLinkCreator] = useState<UserInfoResponse>();
    const [source, setSource] = useState<{
        linkId: number,
        utmSource: string | null,
    }>({
        linkId: -2,
        utmSource: (utm_source as string) || null
    });

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

    const handleRequestSui = async () =>
    {
        if (account)
        {
            setLoadingBuySui(true);
            const res = await fetch('https://faucet.devnet.aptoslabs.com/fund', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    address: account.address,
                    amount: 1000000000
                })
            });
            const val = await res.json();
            fetchAccountBalance(account.address);
            setLoadingBuySui(false);
            // const request = await requestSuiFromFaucet(NETWORK, user?.userAddr || wallet?.address);
            // const { task } = await request.json();
            // console.log(task);
            // checkRequestStatus(task);
        }
    };

    const checkRequestStatus = async (task: string) =>
    {
        setTimeout(async () =>
        {
            setLoadingBuySui(false);
            await fetchAccountBalance(user?.address);
        }, 3000);
    }

    const handleSendSui = () =>
    {
        if (user && !wallet)
        {

        } else { doSendAPT() };
    };

    const doSendAPT = () =>
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
                    console.log('Add source', srcInfo);
                    const transaction = {
                        ...trans, ...{
                            sourceId: srcInfo?.id,
                            receiver: linkCreator.id,
                            amount: formResult.amount,
                            name: formResult.name,
                            note: formResult.note
                        }
                    };
                    const addTranRes = await transSvc.add(transaction);
                    console.log('Add trans', addTranRes);
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
                    console.log('doSendAPT', error);
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
                <Stack direction={'row'} spacing={2}>
                    <Stack flex={1}>
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
                                        value={linkCreator?.about}
                                        disabled
                                    />
                                    <Card>
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
                                                                    <Iconify icon={'token:aptos'} width={28} height={28} />
                                                                </Label>
                                                            </Stack>
                                                        </CardContent>
                                                    </Card>
                                                }
                                                )}
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Stack>
                    <Stack flex={1} spacing={2}>
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
                                        <Iconify icon={'token:aptos'} width={40} height={40} />
                                        <Iconify icon={'eva:close-fill'} width={16} height={16} />
                                        {formConfig.amounts.map((a: any, index: number) => (
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
                                                                    border:0
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
                                                            placeholder='Any APT'
                                                            sx={{ width: 120, borderRadius: 1 }}
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
                                                    <Iconify icon={'token:aptos'} width={28} height={28} />
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
                                                    onClick={handleSendSui}>
                                                    <Stack direction={'row'} justifyContent={'center'} alignItems={'center'} gap={1}>
                                                        <Iconify icon={'tabler:heart-filled'} color={'inherit'} />
                                                        <span>Donate</span>
                                                    </Stack>
                                                </LoadingButton>
                                                <LoadingButton
                                                    loading={loadingBuySui}
                                                    title='Request APT From Faucet'
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
                                                    <span>Not enough APT ? Buy APT here</span>
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
                                        <AptosLoginForm />
                                    }
                                </Stack>
                            </CardContent>
                        </Card>
                    </Stack>

                </Stack>

                <Dialog
                    open={openConfirmDialog}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={() => { setOpenConfirmDialog(false); }}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle>{"Use Google's location service?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            Let Google help apps determine location. This means sending anonymous
                            location data to Google, even when no apps are running.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => { setOpenConfirmDialog(false); }}>Disagree</Button>
                        <Button onClick={() => { doSendAPT(); }}>Agree</Button>
                    </DialogActions>
                </Dialog>
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
            <AptosProvider createnewAccount={false}>
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
            </AptosProvider>
        </Page >
    )
}
