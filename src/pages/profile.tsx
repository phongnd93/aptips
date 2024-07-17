// @mui
import { styled } from '@mui/material/styles';
// layouts
import Layout from '../layouts';
import Page from '../components/Page';
import { Box, Card, CardContent, Container, Stack, StackProps, TextField, Typography, useTheme } from '@mui/material';

import useSuiAuth from 'src/hooks/useSuiAuth';
import { useEffect, useRef, useState } from 'react';
import UserServices from 'src/services/UserServices';

import { LoadingButton } from '@mui/lab';
import MyAvatar from 'src/components/MyAvatar';
import Label from 'src/components/Label';
import Iconify from 'src/components/Iconify';
import { shortenSuiAddress } from '@polymedia/suits';

import { useSnackbar } from 'notistack';


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
    const { user, info, balances, wallet, updateProfile } = useSuiAuth();
    const userSvc = new UserServices();
    const [fullName, setFullName] = useState<string>(info?.fullName!);
    const [about, setAbout] = useState<string>(info?.about!);

    const [loading, setLoading] = useState<boolean>(false);

    const { enqueueSnackbar } = useSnackbar();

    const onChangeInfo = async(e: any) =>
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
            setTimeout(() =>{
                if (res?.data)
                {
                    updateProfile(res.data);
                }
                setLoading(false);
                enqueueSnackbar('Saved successfully', 'success' );
            }, 800)
        });

    }

    console.log(info);

    return (
        <Page title="Home">
            <Container sx={{ mt: 20, mb: 5 }}>
                <Stack alignItems={'center'} flex={2}>
                    <Box sx={{ display: 'flex' }}>
                        <Card sx={{ minWidth: 200, mr: 5 }}>
                            <Stack spacing={3} alignItems={'center'}>
                                <Typography align='center' sx={{ pt: 2, display: 'flex' }}>
                                    <MyAvatar sx={{ width: 50, height: 50 }} />
                                </Typography>
                            </Stack>
                            <CardContent>
                                <Stack spacing={3}>
                                    <Typography align='left'>
                                        <Label color='info' sx={{ minWidth: 60, mr: 3, minHeight: 40 }}>
                                            SUI:
                                        </Label>
                                        <Label color='default' sx={{ minWidth: 210, maxWidth: 220, color: 'text.secondary', minHeight: 40  }}>
                                            {balances} <Iconify icon={'token-branded:sui'} width={24} height={24} />
                                        </Label>
                                    </Typography>
                                    <Typography align='left'>
                                        <Label color='info' sx={{ minWidth: 60, mr: 3, minHeight: 40  }}>
                                            Wallet:
                                        </Label>
                                        <Label color='default' sx={{ minWidth: 210, maxWidth: 220, color: 'text.secondary', minHeight: 40  }}>
                                            {shortenSuiAddress(user?.userAddr || wallet?.address, 6, 15, '...', '_wallet_')}
                                        </Label>
                                    </Typography>
                                   
                                    <Typography align='left'>
                                        <Label color='info' sx={{ minWidth: 60, mr: 3, minHeight: 40  }}>
                                            Email:
                                        </Label>
                                        {
                                            wallet?.label && <Label 
                                            sx={{ color: 'text.secondary', minWidth: 210, maxWidth: 220, minHeight: 40  }} color='default'>
                                            {wallet.label}
                                            </Label>
                                        }
                                    </Typography>
                    
                                </Stack>
                            </CardContent>
                        </Card>
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
                                        rows={3}
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
                    </Box>
                </Stack>
            </Container>
        </Page>
    );
}
