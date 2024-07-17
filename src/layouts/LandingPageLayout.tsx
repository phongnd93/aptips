import { styled, useTheme } from '@mui/material/styles';
import { AppBar, Toolbar, Container, Stack, Typography, Button, Box } from '@mui/material';
import { ReactNode } from 'react'
import { HEADER } from 'src/config';
import useResponsive from 'src/hooks/useResponsive';
import cssStyles from 'src/utils/cssStyles';
import Image from 'src/components/Image';
import Link from 'next/link';
import Iconify from 'src/components/Iconify';
import useOffSetTop from 'src/hooks/useOffSetTop';
import Logo from 'src/components/Logo';

type Props = {
    children: ReactNode
}

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
    height: HEADER.MOBILE_HEIGHT,
    transition: theme.transitions.create(['height', 'background-color'], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.shorter,
    }),
    [theme.breakpoints.up('md')]: {
        height: HEADER.MAIN_DESKTOP_HEIGHT,
    },
}));

const ToolbarShadowStyle = styled('div')(({ theme }) => ({
    left: 0,
    right: 0,
    bottom: 0,
    height: 24,
    zIndex: -1,
    margin: 'auto',
    borderRadius: '50%',
    position: 'absolute',
    width: `calc(100% - 48px)`,
    boxShadow: theme.customShadows.z8,
}));

const MainHeader: React.FC = () =>
{
    const isOffset = useOffSetTop(HEADER.MAIN_DESKTOP_HEIGHT);;

    const theme = useTheme();

    const isDesktop = useResponsive('up', 'md');

    return (
        <AppBar sx={{ boxShadow: 0, bgcolor: 'transparent' }}>
            <ToolbarStyle
                disableGutters
                sx={{
                    ...(isOffset && {
                        ...cssStyles(theme).bgBlur(),
                        height: { md: HEADER.MAIN_DESKTOP_HEIGHT - 16 },
                    }),
                }}
            >
                <Container
                    maxWidth={'md'}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <Stack direction={'row'} alignItems={'center'} gap={2}>
                        <Image
                            sx={{ zIndex: 2, height: 60, width: 60 }}
                            src="/imgs/SuiCup_Logo_2.png"
                            alt="suicuplogo2"
                            visibleByDefault
                            disabledEffect
                        />
                        <Stack>
                            <Typography variant="h4" color={(theme) => theme.palette.primary.main}>SuiCup</Typography>
                            <Typography variant='h6' color={(theme) => theme.palette.primary.main}>Sui Me a Coffee</Typography>
                        </Stack>
                    </Stack>
                    <Link href={'/dashboard'}>
                        <Button variant='contained' sx={{ borderRadius: 10 }}>
                            <Stack direction={'row'} spacing={3}>
                                <Typography variant='h6'>Launch APP</Typography>
                                <Iconify icon={'grommet-icons:form-next-link'} width={24} height={24} />
                            </Stack>
                        </Button>
                    </Link>
                </Container>
            </ToolbarStyle>
            {isOffset && <ToolbarShadowStyle />}
        </AppBar>
    );
}

export default function LandingPageLayout({ children }: Props)
{
    return (
        <Stack sx={{ minHeight: 1 }}>
            <MainHeader />
            {children}
            <Box
                sx={{
                    py: 5,
                    textAlign: 'center',
                    position: 'relative',
                    bgcolor: 'background.default',
                }}
            >
                <Container>
                    <Logo sx={{ mb: 1, mx: 'auto' }} />

                    <Typography variant="caption" component="p">
                        © All rights reserved
                        <br /> made by &nbsp;
                        <Link href="">SubCli team</Link>
                    </Typography>
                </Container>
            </Box>
        </Stack>
    );
}