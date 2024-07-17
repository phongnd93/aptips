import Layout from '../../../layouts';
import Page from '../../../components/Page';
import { Box, Button, Card, CardContent, Container, Grid, IconButton, InputAdornment, OutlinedInput, Popover, Stack, Tooltip } from '@mui/material';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import { SUI_DONA_PATH } from 'src/routes/paths';
import { styled } from '@mui/material/styles';
import { QRCode } from 'react-qrcode-logo';
import { useRef, useState, useEffect } from 'react';
import Iconify from 'src/components/Iconify';
import { ShareSocial } from 'src/components/share';
import { makeid } from 'src/utils/makeid';
import { FormDonationConfig } from 'src/components/form/FormDonationConfig';

const RootStyle = styled('div')(({ theme }) => ({
    paddingTop: theme.spacing(15),
    paddingBottom: theme.spacing(5),
}));

// ----------------------------------------------------------------------
ManagerFormDonation.getLayout = function getLayout(page: React.ReactElement)
{
    return <Layout>{page}</Layout>;
};
// ----------------------------------------------------------------------

export default function ManagerFormDonation()
{
    const initTempConfig: Record<string, any> = {
        title: 'Donation',
        subtitle: 'Empower a Girl: For Self-Reliance',
        amount: ['1', '3', '5', false],
        logoImage: '',
        link: 'suidona.subcli.top/abcxyz123',
    }

    const [tempConfig, setTempConfig] = useState<Record<string, any>>(initTempConfig);
    const [isOpenShare, setIsOpenShare] = useState<null | HTMLElement>(null);
    const [donationLink, setDonationLink] = useState<string>('');

    useEffect(() =>
    {
        handleGenerateLink();
    }, []);

    const handleOpenShare = (event: React.MouseEvent<HTMLButtonElement>) =>
    {
        setIsOpenShare(event.currentTarget);
    };

    const handleCloseShare = () =>
    {
        setIsOpenShare(null);
    };

    const handleGenerateLink = () =>
    {
        if (typeof window !== 'undefined')
        {
            const { protocol, hostname, port } = window.location;
            setDonationLink(`${protocol}//${hostname}${(hostname === 'localhost' && port) ? `:${port}` : ''}/${makeid(10)}`)
        }
    };

    const fileInputRef = useRef<HTMLInputElement>(null);

    const retrievePathFile = (files: any) =>
    {
        const file = files[0];

        if (!file) { return false; }

        if (file.type !== 'image/png' && file.type !== 'image/jpeg')
        {
            console.error('Only png and jpg/jpeg allowed.')
        }
        else
        {
            const target: any = {};
            const reader = new FileReader();
            reader.onload = (e) =>
            {
                target.name = file.name;
                target.value = reader.result
                target.logoName = file.name;
                setTempConfig(prevState => ({ ...prevState, logoImage: target }))
            }
            reader.readAsDataURL(file);
        }
    };

    return (
        <Page title="Manager: Form Donation">
            <RootStyle>
                <Container>
                    <Stack spacing={1} direction={'row'}>
                        <HeaderBreadcrumbs
                            heading='Manager Form Donation'
                            links={[
                                { name: 'Manager', href: SUI_DONA_PATH.manager.root },
                                { name: 'Manager Form Donation' },
                            ]}
                        />
                        <Tooltip
                            placement='top'
                            title='Click QR Code to change image'
                            arrow
                        >
                            <Box
                                sx={{ cursor: 'pointer' }}
                                paddingTop={0.15}
                            >
                                <Iconify
                                    icon={'material-symbols-light:help'}
                                    width={32}
                                    height={32}
                                    color={'#00BDD6FF'}
                                />
                            </Box>
                        </Tooltip>
                    </Stack>
                </Container>
            </RootStyle>
            <Container sx={{ mt: 5, mb: 5 }}>
                <Grid container spacing={6}>
                    <Grid item xs={6}>
                        <Card>
                            <CardContent>
                                <FormDonationConfig
                                    tempConfig={tempConfig}
                                    setTempConfig={setTempConfig}
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6}>
                        <Stack spacing={4} alignItems={'center'}>
                            <Card
                                sx={{ width: '100%' }}
                            >
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Tooltip
                                        placement='top'
                                        title='Create your own QR Code to get your first donation'
                                        arrow
                                    >
                                        <Box
                                            onClick={() => fileInputRef.current?.click()}
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            <QRCode
                                                qrStyle='fluid'
                                                size={250}
                                                logoPadding={5}
                                                logoPaddingStyle={'circle'}
                                                logoWidth={80}
                                                logoHeight={80}
                                                logoImage={tempConfig?.logoImage?.value}
                                                value={donationLink}
                                            />
                                        </Box>
                                    </Tooltip>
                                </CardContent>
                            </Card>
                            <OutlinedInput
                                color='info'
                                size='small'
                                fullWidth
                                value={donationLink}
                                disabled
                                readOnly
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleGenerateLink}
                                            edge="end"
                                        >
                                            <Iconify icon="mage:reload" width={24} height={24} />
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                            <Button
                                variant='contained'
                                color='info'
                                sx={{ width: 100, borderRadius: 5 }}
                                onClick={handleOpenShare}
                                disabled={!donationLink ? true : false}
                            >
                                Share
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
            {/** Popup Area */}
            <input
                ref={fileInputRef}
                type='file'
                name='logoImage'
                accept='image/*'
                hidden
                onChange={(event) => { retrievePathFile(event.target.files) }}
            />
            <Popover
                anchorEl={isOpenShare}
                open={Boolean(isOpenShare)}
                onClose={handleCloseShare}
                sx={{ marginTop: 2, marginRight: 0 }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <ShareSocial value={donationLink} />
            </Popover>
        </Page>
    )
};