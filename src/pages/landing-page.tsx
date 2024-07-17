import { m } from 'framer-motion';
import { Button, Stack, Typography } from "@mui/material";
import { Container, Grid, Paper, styled } from "@mui/material";
import Link from "next/link";
import Image from "src/components/Image";
import Page from "src/components/Page";
import useSettings from "src/hooks/useSettings";
import Layout from "src/layouts";
import { varFade, MotionViewport } from 'src/components/animate';


const RootStyle = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(0),
}));

LandingPage.getLayout = function getLayout(page: React.ReactElement)
{
    return <Layout variant="landingPage">{page}</Layout>;
};

const LadingPageComponent = () =>
{
    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Paper sx={{ px: 30, pt: 10 , pb: 5, bgcolor: 'rgba(0, 189, 214, 0.07)', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
                    <m.div variants={varFade().inRight}>
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
                    </m.div>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper sx={{ px: 10, py: 10, bgcolor: 'white' }}>
                    <Stack spacing={0} alignItems={'center'}>
                        <m.div variants={varFade().inUp}>
                            <Image
                                visibleByDefault
                                disabledEffect
                                sx={{ zIndex: 2, height: 513 , width: 574 }}
                                src="/imgs/example_config.png"
                                alt="example config"
                            />
                        </m.div>
                    </Stack>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper sx={{ px: 31.5, py: 5, bgcolor: 'rgba(0, 189, 214, 0.07)' }}>
                    <Stack spacing={5} alignItems={'center'}>
                        <m.div variants={varFade().inUp}>
                            <Typography variant="h2" fontWeight={'700'}>
                                Easy way to say thanks from your fans
                            </Typography>   
                            <Typography fontSize={24} fontWeight={'500'}>
                                <span style={{ color: '#00BDD6'}}>Sui me a coffee</span> makes a easy and funny way,<br /> like receiving a cup of coffee from people loving you.
                            </Typography>
                        </m.div>
                        
                    </Stack>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper sx={{ pt: 10, pb: 20, bgcolor: 'white' }}>
                    <Stack spacing={5} alignItems={'center'}>
                        <m.div variants={varFade().inUp}>
                            <Typography px={15} variant="h2" fontWeight={'700'}>
                                Decentralized Tipping Platform for Creators
                            </Typography>
                        </m.div>
                        <Stack direction={'row'} gap={3} justifyItems={'center'}>
                            <Stack gap={1} alignItems={'center'}>
                                <m.div variants={varFade().inDown}>
                                    <Typography variant="h5">Motivate contributions</Typography>
                                    <Typography sx={{ px: 5 }} fontSize={18}>Increase motivation for Web3 community with token of SUI ecosystem</Typography>
                                </m.div>
                            </Stack>
                            <Stack gap={1} alignItems={'center'}>
                                <m.div variants={varFade().inDown}>
                                    <Typography variant="h5" alignItems={'center'}>Ease of Use</Typography>
                                    <Typography sx={{ px: 5 }} fontSize={18}>Creators generate links/QR codes; supporters donate with a click (Web & Mobile)</Typography>
                                </m.div>
                            </Stack>
                            <Stack gap={1} alignItems={'center'}>
                                <m.div variants={varFade().inDown}>
                                    <Typography variant="h5" alignItems={'center'}>Wordpress plugin</Typography>
                                    <Typography sx={{ px: 5 }} fontSize={18}>Receive support from millions of users on wordpress</Typography>
                                </m.div>
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
                <Container component={MotionViewport} maxWidth={themeStretch ? false : 'lg'} sx={{
                    textAlign: 'center',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mt: '71.5px',
                }} >
                    <LadingPageComponent />
                </Container>
            </RootStyle>
        </Page>
    );
}