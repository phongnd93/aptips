// @mui
// layouts
import Layout from '../layouts';
import Page from '../components/Page';
import { Button, Card, CardContent, Container, Grid, IconButton, InputAdornment, Menu, MenuItem, Stack, TextField, Typography } from '@mui/material';

import useAptos from 'src/hooks/useAptos';
import { useEffect, useRef, useState } from 'react';
import UserServices from 'src/services/UserServices';

import { LoadingButton } from '@mui/lab';
import MyAvatar from 'src/components/MyAvatar';
import Label from 'src/components/Label';
import Iconify from 'src/components/Iconify';
import { shortenSuiAddress } from '@polymedia/suits';

import { useSnackbar } from 'notistack';
import useSettings from 'src/hooks/useSettings';
import { _SOCIALS } from '../constants/social';
import { UserInfoResponse } from 'src/@types/dto/user-dto';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useTheme } from '@mui/material/styles';
import useResponsive from 'src/hooks/useResponsive';

Profile.getLayout = function getLayout(page: React.ReactElement)
{
    return <Layout>{page}</Layout>;
};

export default function Profile()
{
    const { themeStretch } = useSettings();
    const isDesktop = useResponsive('up','md');
    const { user, info, balances, wallet, updateProfile } = useAptos();
    const {account} = useWallet();
    const userSvc = new UserServices();

    const [loading, setLoading] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl); const isInit = useRef(false);

    const [formData, setFormData] = useState<UserInfoResponse | null>();

    useEffect(() =>
    {
        if (info && !isInit.current)
        {
            setFormData(info);
        }
    }, [info]);

    const handleClose = () =>
    {
        setAnchorEl(null);
    };
    // const [socials, setSocials] = useState<{ name: string, link: string }[]>([]);

    const { enqueueSnackbar } = useSnackbar();

    const onChangeInfo = async (e: any) =>
    {
        if (formData)
        {
            setLoading(true)
            await userSvc.update({
                ...formData,
                ...{ about: JSON.stringify(formData?.detailAbout) }
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
    }

    const handleAddMoreSocialMenuClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    {
        setAnchorEl(event.currentTarget);
    }

    const handleAddSocial = (s: string) =>
    {
        setAnchorEl(null);
        const detailAbout = { ...formData?.detailAbout };
        if (!detailAbout?.socials) detailAbout.socials = [];
        detailAbout.socials.push({ name: s, link: '' });
        setFormData({ ...formData, ...{ detailAbout: detailAbout } });
    }
    const handleRemoveSocialLink = (s: any, i: number) =>
    {
        const detailAbout = { ...formData?.detailAbout };
        detailAbout.socials.splice(i, 1);
        setFormData({ ...formData, ...{ detailAbout: detailAbout } });
    }
    return (
        <Page title="Profile">
            <Container maxWidth={themeStretch ? false : 'lg'} sx={{ mt: isDesktop ? 20 : 10 }}>
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
                                            <Iconify icon={'token:aptos'} width={24} height={24} />
                                        </Label>
                                        <Label color='default' sx={{ flex: 1, py: 3 }}>
                                            {balances}
                                        </Label>
                                    </Stack>
                                    <Stack direction={'row'} spacing={2}>
                                        <Label color='info' sx={{ minWidth: 60, py: 3, textAlign: 'end' }}>
                                            <Iconify icon={'game-icons:wallet'} color={(theme) => theme.palette.primary.main} width={24} height={24} />
                                        </Label>
                                        <Label color='default' sx={{ flex: 1, py: 3 }}>
                                            {shortenSuiAddress(info?.walletAddress, 6, 15, '...', '_wallet_')}
                                        </Label>
                                    </Stack>
                                    <Stack direction={'row'} spacing={2} alignItems={'center'}>
                                        <Label color='info' sx={{ minWidth: 60, py: 3, textAlign: 'end' }}>
                                            <Iconify icon="material-symbols:attach-email-outline-rounded" color={(theme) => theme.palette.primary.main} width={24} height={24} />
                                        </Label>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            value={formData?.email || ''}
                                            onChange={(e) =>
                                            {
                                                setFormData({ ...formData, ...{ email: e.target.value } });
                                            }}
                                        />
                                    </Stack>
                                    {formData?.detailAbout?.socials?.length > 0 && formData?.detailAbout?.socials.map((s: any, i: number) =>
                                    {
                                        const sInfo = _SOCIALS.find(si => si.name === s.name);
                                        return <Stack direction={'row'} spacing={2} alignItems={'center'}>
                                            <Label color='info' sx={{ minWidth: 60, py: 3, textAlign: 'end' }}>
                                                <Iconify icon={sInfo!.icon} color={sInfo!.color} width={24} height={24} />
                                            </Label>
                                            <TextField
                                                key={`${s.name}-${i}`}
                                                fullWidth
                                                variant="outlined"
                                                value={s.link}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton sx={{ m: 0, p: 0 }} onClick={() => { handleRemoveSocialLink(s, i) }}>
                                                                <Iconify icon='lets-icons:close-ring-duotone' color='text.danger' width={24} height={24} />
                                                            </IconButton>
                                                        </InputAdornment>
                                                    )
                                                }}
                                                onChange={(e) =>
                                                {
                                                    const detailAbout = { ...formData?.detailAbout };
                                                    detailAbout.socials[i].link = e.target.value;
                                                    setFormData({ ...formData, ...{ detailAbout: detailAbout } });
                                                    // setFormData({ ...formData, ...{ fullName: e.tartget.value } });
                                                }}
                                            />
                                        </Stack>;
                                    })}
                                </Stack>
                                <Button
                                    variant='outlined'
                                    title='Add Social Link'
                                    onClick={handleAddMoreSocialMenuClick}
                                    sx={{ mt: 2 }}>
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
                            </CardContent>
                        </Card>

                    </Grid>
                    <Grid item xs={12} md={7}>
                        <Card>
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
                                        value={formData?.fullName}
                                        onChange={(e) =>
                                        {
                                            setFormData({ ...formData, ...{ fullName: e.target.value } });
                                        }}
                                    />
                                    <TextField
                                        id="outlined-number"
                                        label="About"
                                        rows={10}
                                        placeholder='Say something nice...(optional)'
                                        fullWidth
                                        multiline
                                        value={formData?.detailAbout?.content || ''}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        onChange={(e) =>
                                        {
                                            const newDetailAbout = { ...formData?.detailAbout, ...{ content: e.target.value } };
                                            setFormData({ ...formData, ...{ detailAbout: newDetailAbout } });
                                        }}
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
