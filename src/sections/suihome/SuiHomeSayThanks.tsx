import { m } from 'framer-motion';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Box, Container, Typography, Link, Stack } from '@mui/material';
// components
import { MotionViewport, varFade } from '../../components/animate';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
    paddingTop: theme.spacing(15),
    backgroundColor: '#00BDD612',
    [theme.breakpoints.up('md')]: {
        paddingBottom: theme.spacing(15),
    },
}));

// ----------------------------------------------------------------------

export default function SuiHomeSayThanks()
{
    return (
        <RootStyle>
            <Container component={MotionViewport} maxWidth={'sm'} textAlign={'center'}>
                <Stack spacing={3} alignItems={'center'}>
                    <m.div variants={varFade().inUp}>
                        <Typography variant="h2" fontWeight={'700'}>
                            Easy way to say thanks from your fans
                        </Typography>
                    </m.div>
                    <m.div variants={varFade().inDown}>
                        <Typography fontSize={24} fontWeight={'500'}>
                            <span style={{ color: '#00BDD6' }}>Sui Me a Coffee</span> makes it simple and fun,<br /> like receiving a cup of coffee from people who love you.
                        </Typography>
                    </m.div>
                </Stack>
            </Container>
        </RootStyle>
    );
}
