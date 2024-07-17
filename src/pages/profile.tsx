// @mui
// layouts
import Layout from '../layouts';
import Page from '../components/Page';
import { Button, Card, CardContent, Container, Grid, IconButton, InputAdornment, Menu, MenuItem, Stack, TextField, Typography } from '@mui/material';

import useSuiAuth from 'src/hooks/useSuiAuth';
import { useState } from 'react';
import UserServices from 'src/services/UserServices';

import { LoadingButton } from '@mui/lab';
import MyAvatar from 'src/components/MyAvatar';
import Label from 'src/components/Label';
import Iconify from 'src/components/Iconify';
import { shortenSuiAddress } from '@polymedia/suits';

import { useSnackbar } from 'notistack';
import useSettings from 'src/hooks/useSettings';

Profile.getLayout = function getLayout(page: React.ReactElement)
{
    return <Layout>{page}</Layout>;
};

export default function Profile()
{
    const _SOCIALS = [{
        name: 'twitter',
        icon: 'foundation:social-twitter',
        color: '#1DA1F2'
    }, {
        name: 'telegram',
        icon: 'fa-brands:telegram-plane',
        color: '#26a4e3'
    }, {
        name: 'discord',
        icon: 'logos:discord-icon',
    }, {
        name: 'facebook',
        icon: 'foundation:social-facebook',
        color: '#1877F2'
    }];
    const { themeStretch } = useSettings();
    const { user, info, balances, wallet, updateProfile } = useSuiAuth();
    const userSvc = new UserServices();
    const [fullName, setFullName] = useState<string>(info?.fullName!);
    const [about, setAbout] = useState<string>(info?.about!);

    const [loading, setLoading] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClose = () =>
    {
        setAnchorEl(null);
    };
    const [socials, setSocials] = useState<{ name: string, link: string }[]>([]);

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
                enqueueSnackbar('Saved successfully', {
                    variant: 'success'
                });
            }, 800)
        });

    }

    const handleAddMoreSocialMenuClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    {
        setAnchorEl(event.currentTarget);
    }

    const handleAddSocial = (s: string) =>
    {
        setAnchorEl(null);
        setSocials([...socials, ...[{ name: s, link: '' }]]);
    }
    const handleRemoveSocialLink = (s: any, i: number) =>
    {
        const newSocials = [...socials];
        newSocials.splice(i, 1);
        setSocials(newSocials);
    }

    return (
        <Page title="Profile">
            <Container maxWidth={themeStretch ? false : 'lg'} sx={{ mt: 20 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={5}>
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
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            value={info?.email || wallet.label}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Iconify icon="material-symbols:attach-email-outline-rounded" width={24} height={24} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Stack>
                                    {socials?.length > 0 && socials.map((s, i) =>
                                    {
                                        const sInfo = _SOCIALS.find(si => si.name === s.name);
                                        return <TextField
                                            key={`${s.name}-${i}`}
                                            fullWidth
                                            variant="outlined"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Iconify icon={sInfo.icon} color={sInfo.color} width={24} height={24} />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={() => { handleRemoveSocialLink(s, i) }}>
                                                            <Iconify icon='lets-icons:close-ring-duotone' color='text.danger' width={24} height={24} />
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }}
                                        />;
                                    })}
                                </Stack>
                            </CardContent>
                        </Card>
                        <Button
                            variant='contained'
                            title='Add Social Link'
                            onClick={handleAddMoreSocialMenuClick}>
                            <Iconify icon={'fluent:link-add-24-filled'} width={24} height={24} />
                        </Button>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            {_SOCIALS.map(s => (
                                <MenuItem onClick={() => { handleAddSocial(s.name); }}><Iconify icon={s.icon} width={24} height={24} color={s.color} /></MenuItem>
                            ))}
                        </Menu>
                    </Grid>
                    <Grid item xs={12} md={7}>
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
