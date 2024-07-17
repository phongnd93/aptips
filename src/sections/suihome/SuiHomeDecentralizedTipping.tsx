import { m } from 'framer-motion';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Box, Container, Typography, Link, Stack, Card, alpha } from '@mui/material';
// components
import { MotionViewport, varFade } from '../../components/animate';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
    paddingTop: theme.spacing(15),
    backgroundColor: theme.palette.background.default,
    [theme.breakpoints.up('md')]: {
        paddingBottom: theme.spacing(15),
    },
}));
const CardStyle = styled(Card)(({ theme }) =>
{
    const shadowCard = (opacity: number) =>
        theme.palette.mode === 'light'
            ? alpha(theme.palette.grey[500], opacity)
            : alpha(theme.palette.common.black, opacity);

    return {
        border: 0,
        margin: 'auto',
        minHeight: 'fit-content',
        textAlign: 'center',
        padding: theme.spacing(10, 3, 10),
        boxShadow: theme.customShadows.z12,
        [theme.breakpoints.up('md')]: {
            boxShadow: 'none',
            backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
        },
        '&.cardLeft': {
            [theme.breakpoints.up('md')]: { marginTop: -40 },
        },
        '&.cardCenter': {
            [theme.breakpoints.up('md')]: {
                marginTop: -80,
                backgroundColor: theme.palette.background.paper,
                boxShadow: `-40px 40px 80px 0 ${shadowCard(0.4)}`,
                '&:before': {
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: -1,
                    content: "''",
                    margin: 'auto',
                    position: 'absolute',
                    width: 'calc(100% - 40px)',
                    height: 'calc(100% - 40px)',
                    borderRadius: Number(theme.shape.borderRadius) * 2,
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: `-20px 20px 40px 0 ${shadowCard(0.12)}`,
                },
            },
        },
    };
});

// ----------------------------------------------------------------------

export default function SuiHomeDecentralizedTipping()
{
    return (
        <RootStyle>
            <Container component={MotionViewport} maxWidth={'md'} textAlign={'center'}>
                <Stack spacing={3} alignItems={'center'}>
                    <m.div variants={varFade().inUp}>
                        <Typography variant="h2" fontWeight={'700'}>
                            Decentralized Donation
                        </Typography>
                        <Typography variant="h2" fontWeight={'700'}>
                            Platform for Creators
                        </Typography>
                    </m.div>
                    <Box
                        sx={{
                            display: 'grid',
                            gap: { xs: 2, lg: 3 },
                            gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' },
                            pt:10
                        }}
                    >
                        <m.div variants={varFade().inUp}>
                            <CardStyle
                                className={'cardLeft'}
                            >
                                <Stack alignItems={'center'}>
                                    <Typography variant="h4">Motivate contributions</Typography>
                                    <Typography variant='body1'>Increase motivation for Web3 community with tokens of Sui ecosystem</Typography>
                                </Stack>
                            </CardStyle>
                        </m.div>
                        <m.div variants={varFade().inUp}>
                            <CardStyle
                                className={'cardCenter'}
                            >
                                <Stack alignItems={'center'}>
                                    <Typography variant="h4" alignItems={'center'}>Ease of Use</Typography>
                                    <Typography variant='body1'>Creators generate links/QR codes; supporters donate with a click (Web & Mobile)</Typography>
                                </Stack>
                            </CardStyle>
                        </m.div>
                        <m.div variants={varFade().inUp}>
                            <CardStyle>
                                <Stack alignItems={'center'}>
                                    <Typography variant="h4" alignItems={'center'}>Wordpress plugin</Typography>
                                    <Typography variant='body1'>Receive support from millions of users on Wordpress</Typography>
                                </Stack>
                            </CardStyle>
                        </m.div>
                    </Box>
                </Stack>
            </Container>
        </RootStyle>
    );
}
