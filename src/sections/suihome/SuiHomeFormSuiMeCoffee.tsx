import { m } from 'framer-motion';
// @mui
import { styled } from '@mui/material/styles';
import Image from "src/components/Image";
import { Container, Stack } from '@mui/material';
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

// ----------------------------------------------------------------------

export default function SuiHomeFormSuiMeCoffee()
{
    return (
        <RootStyle>
            <Container component={MotionViewport} maxWidth={'sm'} textAlign={'center'}>
                <Stack spacing={0} alignItems={'center'}>
                    <m.div variants={varFade().inDown}>
                        <Image
                            visibleByDefault
                            disabledEffect
                            sx={{ zIndex: 2 }}
                            src="/imgs/example_config.png"
                            alt="example config"
                        />
                    </m.div>
                </Stack>
            </Container>
        </RootStyle>
    );
}
