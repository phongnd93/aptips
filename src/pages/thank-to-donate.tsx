import { styled } from '@mui/material/styles';
import { Container, Typography, Button, Stack, useTheme, Link } from "@mui/material";
import { MaintenanceIllustration } from "src/assets";
import Layout from "src/layouts";
import Page from '../components/Page';
import useSettings from '../hooks/useSettings';
import Image from 'src/components/Image';
import Iconify from 'src/components/Iconify';
import { PATH_DASHBOARD } from 'src/routes/paths';

const RootStyle = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(10),
}));

// ----------------------------------------------------------------------

ThankToDonate.getLayout = function getLayout(page: React.ReactElement)
{
    return <Layout variant="logoOnly">{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function ThankToDonate()
{
    const { themeStretch } = useSettings();
    const theme = useTheme();
    const amount = localStorage.getItem('donate_amount');
    // localStorage.removeItem('donate_amount');
    return (
        <Page title="Thank to Donation">
            <RootStyle>
                <Container maxWidth={themeStretch ? false : 'lg'} sx={{
                    textAlign: 'center',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }} >
                    <Stack alignItems='center' justifyContent='start'>
                        <Image
                            visibleByDefault
                            disabledEffect
                            sx={{ zIndex: 2, height: 334, width: 364 }}
                            src="/imgs/thank-to-donate.png"
                            alt="thank-to-donate"
                        />
                        <Typography variant="h3" paragraph>
                            Thank you for your donation
                        </Typography>
                        <Typography sx={{ color: 'text.secondary' }} paragraph>
                            We are currently working hard!
                        </Typography>
                        <Stack spacing={5} direction={'row'} sx={{ borderBottom: `1px solid ${theme.palette.grey[500]}` }} pb={1} mb={5}>
                            <Image src='/imgs/image-donation.png' sx={{ width: 48, height: 48 }} />
                            <Stack >
                                <Typography variant="h5">
                                    Your donation
                                </Typography>
                                <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                                    Empower a Girl: For Self-Reliance
                                </Typography>
                            </Stack>
                            <Typography variant="h3">
                                <Stack spacing={'1'} direction={'row'} justifyContent={'center'} justifyItems={'center'} alignItems={'center'}>
                                    <span>{amount}</span>
                                    <Iconify icon={'token-branded:sui'} width={32} height={32} />
                                </Stack>
                            </Typography>
                        </Stack>
                        <Link href={PATH_DASHBOARD.root}>
                            <Stack direction={'row'} justifyContent={'center'} alignItems={'center'}>
                                <Typography variant='h6'>Start your SuiCup</Typography>
                                <Iconify icon={'grommet-icons:form-next-link'} width={24} height={24} />
                            </Stack>
                        </Link>
                        {/* <Button variant='outlined' href='/'>
                            <Stack spacing={1} direction={'row'}>
                                <Iconify icon={'fxemoji:loveletter'} width={20} height={20} />
                                <Typography component={'span'}>Join us to get your own CoffeeChain</Typography>
                            </Stack>
                        </Button> */}
                        {/* <MaintenanceIllustration sx={{ my: 10, height: 240 }} /> */}
                    </Stack>
                </Container>
            </RootStyle>
        </Page>
    );
}