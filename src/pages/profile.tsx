// @mui
import { styled } from '@mui/material/styles';
// layouts
import Layout from '../layouts';
import Page from '../components/Page';
import { Box, Card, CardContent, Container, Grid, Stack, StackProps, TextField, Typography, useTheme } from '@mui/material';

import useSuiAuth from 'src/hooks/useSuiAuth';
import { useEffect, useRef, useState } from 'react';
import UserServices from 'src/services/UserServices';

import { LoadingButton } from '@mui/lab';
import MyAvatar from 'src/components/MyAvatar';
import Label from 'src/components/Label';
import Iconify from 'src/components/Iconify';
import { shortenSuiAddress } from '@polymedia/suits';

import { useSnackbar } from 'notistack';
import useSettings from 'src/hooks/useSettings';


const ContentStyle = styled((props: StackProps) => <Stack spacing={5} {...props} />)(
    ({ theme }) => ({
        margin: 'auto',
        textAlign: 'center',
        paddingTop: theme.spacing(15),
        paddingBottom: theme.spacing(1),
        alignContent: 'center',
        alignItems: 'center',
        [theme.breakpoints.up('md')]: {
            margin: 'unset',
            textAlign: 'left',
        },
    })
);
// ----------------------------------------------------------------------
const LabelStyle = styled(Typography)(({ theme }) => ({
    ...theme.typography.subtitle2,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
}));

Profile.getLayout = function getLayout(page: React.ReactElement)
{
    return <Layout>{page}</Layout>;
};

export default function Profile()
{
    const { themeStretch } = useSettings();
    const { user, info, balances, wallet, updateProfile } = useSuiAuth();
    const userSvc = new UserServices();
    const [fullName, setFullName] = useState<string>(info?.fullName!);
    const [about, setAbout] = useState<string>(info?.about!);

    const [loading, setLoading] = useState<boolean>(false);

    const { enqueueSnackbar } = useSnackbar();

    const onChangeInfo = async (e: any) =>
    {
        setLoading(true)
        await userSvc.update({
            id: info?.id!,
            walletAddress: info?.walletAddress!,
            email: info?.email!,
            avatarUrl: info?.avatarUrl!,
            fullName: fullName,
            about: about,
        }).then((res) =>
        {
            setTimeout(() =>
            {
                if (res?.data)
                {
                    updateProfile(res.data);
                }
                setLoading(false);
                enqueueSnackbar('Saved successfully',{
                    variant:'success'
                });
            }, 800)
        });

    }

    return (
        <Page title="Profile">
            <Container maxWidth={themeStretch ? false : 'lg'} sx={{ mt: 20 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4} >
                        <Card>
                            <Stack spacing={3} alignItems={'center'}>
                                <Typography align='center' sx={{ pt: 2, display: 'flex' }}>
                                    <MyAvatar sx={{ width: 50, height: 50 }} />
                                </Typography>
                            </Stack>
                            <CardContent>
                                <Stack spacing={2}>
                                    <Stack direction={'row'} spacing={2}>
                                        <Label color='info' sx={{ minWidth: 60, py: 3, textAlign: 'end' }}>
                                            SUI:
                                        </Label>
                                        <Label color='default' sx={{ flex: 1, py: 3 }}>
                                            {balances} <Iconify icon={'token-branded:sui'} width={24} height={24} />
                                        </Label>
                                    </Stack>
                                    <Stack direction={'row'} spacing={2}>
                                        <Label color='info' sx={{ minWidth: 60, py: 3, textAlign: 'end' }}>
                                            Wallet:
                                        </Label>
                                        <Label color='default' sx={{ flex: 1, py: 3 }}>
                                            {shortenSuiAddress(user?.userAddr || wallet?.address, 6, 15, '...', '_wallet_')}
                                        </Label>
                                    </Stack>
                                    <Stack direction={'row'} spacing={2}>
                                        <Label color='info' sx={{ minWidth: 60, py: 3, textAlign: 'end' }}>
                                            Email:
                                        </Label>
                                        {
                                            wallet?.label && <Label
                                                sx={{ flex: 1, py: 3 }} color='default'>
                                                {wallet.label}
                                            </Label>
                                        }
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Card sx={{ minWidth: 500 }}>
                            <Stack spacing={3}>
                                <Typography variant='h3' align='center' sx={{ pt: 2 }}>
                                    Profile
                                </Typography>
                            </Stack>
                            <CardContent>
                                <Stack spacing={3}>
                                    <TextField
                                        id="outlined-number"
                                        label="Full Name"
                                        type="text"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        value={fullName}
                                        onChange={(e) => { console.log("d:", e); setFullName(e.target.value) }}
                                    />
                                    <TextField
                                        id="outlined-number"
                                        label="About"
                                        rows={10}
                                        placeholder='Say something nice...(optional)'
                                        fullWidth
                                        multiline
                                        value={about}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        onChange={(e) => { setAbout(e.target.value) }}
                                    />
                                    <LoadingButton
                                        variant='contained'
                                        type='button'
                                        loading={loading}
                                        onClick={onChangeInfo}
                                    >
                                        Save
                                    </LoadingButton>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Page >
    );
}
