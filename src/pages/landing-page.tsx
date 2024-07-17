import { Button, Stack, Typography } from "@mui/material";
import { Container, Grid, Paper, styled } from "@mui/material";
import Link from "next/link";
import Image from "src/components/Image";
import Page from "src/components/Page";
import useSettings from "src/hooks/useSettings";
import Layout from "src/layouts";


const RootStyle = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(0),
}));

LandingPage.getLayout = function getLayout(page: React.ReactElement)
{
    return <Layout variant="logoOnly">{page}</Layout>;
};

const LadingPageComponent = () =>
{
    return (
        <Grid container spacing={0}>
            <Grid item xs={12}>
                <Paper sx={{ px: 30, pt: 15 , pb: 5, bgcolor: 'rgba(0, 189, 214, 0.07)' }}>
                    <Stack spacing={3} alignItems={'center'}>
                        <Typography variant="h1" fontWeight={'700'}>
                            Fund your creative work on <span style={{ color: '#00BDD6' }}>web3</span>
                            </Typography>   
                        <Typography fontSize={32} fontWeight={'400'}>
                            Transparently, securely receive support from your fan
                        </Typography>
                        <Link href={'/'}>
                            <Button
                                variant="contained"
                                size="large"
                                sx={{ borderRadius: '1.5rem', maxWidth: 300, minWidth: 250 }}
                            >
                                Create Support
                            </Button>
                        </Link>
                        <Typography fontSize={24}>It's free and takes less than a minute</Typography>
                    </Stack>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper sx={{ px: 10, py: 10, bgcolor: 'white' }}>
                    <Stack spacing={0} alignItems={'center'}>
                        <Image
                            visibleByDefault
                            disabledEffect
                            sx={{ zIndex: 2, height: 513 , width: 574 }}
                            src="/imgs/example_config.png"
                            alt="example config"
                        />
                    </Stack>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper sx={{ px: 31.5, py: 5, bgcolor: 'rgba(0, 189, 214, 0.07)' }}>
                    <Stack spacing={5} alignItems={'center'}>
                        <Typography variant="h2" fontWeight={'700'}>
                            Easy way to say thanks from your fans
                        </Typography>   
                        <Typography fontSize={24} fontWeight={'500'}>
                            <span style={{ color: '#00BDD6'}}>Sui me a coffee</span> makes a easy and funny way,<br /> like receiving a cup of coffee from people loving you.
                        </Typography>
                    </Stack>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper sx={{ pt: 10, pb: 20, bgcolor: 'white' }}>
                    <Stack spacing={5} alignItems={'center'}>
                        <Typography px={15} variant="h1" fontWeight={'700'}>
                            Decentralized Tipping Platform for Creators
                        </Typography>
                        <Stack direction={'row'} gap={3} justifyItems={'center'}>
                            <Stack gap={1} alignItems={'center'}>
                                <Typography variant="h3">Motivate contributions</Typography>
                                <Typography sx={{ px: 5 }} fontSize={24}>Increase motivation for Web3 community with token of SUI ecosystem</Typography>
                            </Stack>
                            <Stack gap={1} alignItems={'center'}>
                                <Typography variant="h3" alignItems={'center'}>Ease of Use</Typography>
                                <Typography sx={{ px: 5 }} fontSize={24}>Creators generate links/QR codes; supporters donate with a click (Web & Mobile)</Typography>
                            </Stack>
                            <Stack gap={1} alignItems={'center'}>
                                <Typography variant="h3" alignItems={'center'}>Wordpress plugin</Typography>
                                <Typography sx={{ px: 5 }} fontSize={24}>Receive support from millions of users on wordpress</Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default function LandingPage()
{
    const { themeStretch } = useSettings();
    return (
        <Page title="Landing Page">
            <RootStyle>
                <Container maxWidth={themeStretch ? false : 'lg'} sx={{
                    textAlign: 'center',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }} >
                    <LadingPageComponent />
                </Container>
            </RootStyle>
        </Page>
    );
}