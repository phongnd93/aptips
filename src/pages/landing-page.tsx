import { Button, Stack, Typography } from "@mui/material";
import { Container, Grid, Paper, styled } from "@mui/material";
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
                <Paper sx={{ px: 25, pt: 25, pb: 5, bgcolor: 'rgba(0, 189, 214, 0.07)' }}>
                    <Stack spacing={3} alignItems={'center'}>
                        <Typography variant="h1" fontWeight={'700'}>
                            Fund your creative work on web3
                            </Typography>   
                        <Typography fontSize={25} fontWeight={'500'}>
                            Transparently, securely receive support from your fan
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            sx={{ borderRadius: '1.5rem', maxWidth: 300, minWidth: 250 }}
                        >
                            Create Support
                        </Button>
                        <Typography>It's free and takes less than a minute</Typography>
                    </Stack>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper sx={{ px: 25, pt: 25, pb: 5, bgcolor: 'white' }}>
                    <Stack spacing={3} alignItems={'center'}>

                    </Stack>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper sx={{ px: 30, py: 5, bgcolor: 'rgba(0, 189, 214, 0.07)' }}>
                    <Stack spacing={5} alignItems={'center'}>
                        <Typography variant="h2" fontWeight={'700'}>
                            Easy way to say thanks from your fans
                        </Typography>   
                        <Typography fontSize={25} fontWeight={'500'}>
                            Sui me a coffee makes a easy and funny way, like receiving a cup of coffee from people loving you.
                        </Typography>
                    </Stack>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper sx={{ px: 15, pt: 20, pb: 5, bgcolor: 'white' }}>
                    <Stack spacing={3} alignItems={'center'}>
                        <Typography variant="h1" fontWeight={'700'}>
                            Decentralized Tipping Platform for Creators
                        </Typography>
                        <Stack direction={'row'} gap={3} justifyItems={'center'}>
                            <Stack gap={1} alignItems={'center'} flexBasis={'300px'}>
                                <Typography variant="h4">Motivate contributions</Typography>
                                <Typography sx={{ px: 5 }}>Increase motivation for Web3 community with token of SUI ecosystem</Typography>
                            </Stack>
                            <Stack gap={1} alignItems={'center'} flexBasis={'300px'}>
                                <Typography variant="h4" alignItems={'center'}>Ease of Use</Typography>
                                <Typography sx={{ px: 5 }}>Creators generate links/QR codes; supporters donate with a click (Web & Mobile)</Typography>
                            </Stack>
                            <Stack gap={1} alignItems={'center'} flexBasis={'300px'}>
                                <Typography variant="h4" alignItems={'center'}>Wordpress plugin</Typography>
                                <Typography sx={{ px: 5 }}>Receive support from millions of users on wordpress</Typography>
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