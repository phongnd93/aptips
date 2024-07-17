import { m } from 'framer-motion';
import { Stack, Typography } from "@mui/material";
import { Grid, Paper, styled } from "@mui/material";
import Image from "src/components/Image";
import Page from "src/components/Page";
import Layout from "src/layouts";
import { varFade } from 'src/components/animate';
import SuiHomeFund from 'src/sections/suihome/SuiHomeFund';
import { HomeMinimal, HomeHugePackElements, HomeDarkMode, HomeColorPresets, HomeCleanInterfaces, HomePricingPlans, HomeLookingFor, HomeAdvertisement } from 'src/sections/home';
import SuiHomeFormSuiMeCoffee from 'src/sections/suihome/SuiHomeFormSuiMeCoffee';
import SuiHomeSayThanks from 'src/sections/suihome/SuiHomeSayThanks';
import SuiHomeDecentralizedTipping from 'src/sections/suihome/SuiHomeDecentralizedTipping';

const RootStyle = styled('div')(() => ({
    height: '100%',
}));

const ContentStyle = styled('div')(({ theme }) => ({
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: theme.palette.background.default,
}));

HomePage.getLayout = function getLayout(page: React.ReactElement)
{
    return <Layout variant="landingPage">{page}</Layout>;
};

const LadingPageComponent = () =>
{
    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Paper sx={{ px: 30, pt: 10, pb: 5, bgcolor: 'rgba(0, 189, 214, 0.07)', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>

                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper sx={{ px: 10, py: 10, bgcolor: 'white' }}>
                    <Stack spacing={0} alignItems={'center'}>
                        <m.div variants={varFade().inUp}>
                            <Image
                                visibleByDefault
                                disabledEffect
                                sx={{ zIndex: 2, height: 513, width: 574 }}
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
                                <span style={{ color: '#00BDD6' }}>Sui Me a Coffee</span> makes a easy and funny way,<br /> like receiving a cup of coffee from people loving you.
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
                                    <Typography sx={{ px: 5 }} fontSize={18}>Increase motivation for Web3 community with tokens of Sui ecosystem</Typography>
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
                                    <Typography sx={{ px: 5 }} fontSize={18}>Receive support from millions of users on Wordpress</Typography>
                                </m.div>
                            </Stack>
                        </Stack>
                    </Stack>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default function HomePage()
{
    return (
        <Page title="Home">
            <RootStyle>
                <ContentStyle>
                    <SuiHomeFund />
                    <SuiHomeFormSuiMeCoffee />
                    <SuiHomeSayThanks />
                    <SuiHomeDecentralizedTipping />
                </ContentStyle>
            </RootStyle>
        </Page>
    );
}