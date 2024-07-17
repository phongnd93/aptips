import { styled, useTheme } from '@mui/material/styles'; 
import { AppBar, Toolbar, Container, Stack, Typography, Button } from '@mui/material';
import { ReactNode } from 'react'
import { HEADER } from 'src/config';
import useResponsive from 'src/hooks/useResponsive';
import cssStyles from 'src/utils/cssStyles';
import Image from 'src/components/Image';
import Link from 'next/link';

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
    width: `calc(100% - 50px)`,
    // boxShadow: theme.customShadows.z8,
}));

const MainHeader: React.FC = () =>
{
    const isOffset = true;

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
                    backgroundColor: 'rgba(0, 189, 214, 0.07)',
                }}
            >
                <Container
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <Stack direction={'row'} alignItems={'center'} gap={2}>
                        <Image
                            sx={{ zIndex: 2, height: 60 , width: 60 }}
                            src="/imgs/SuiCup_Logo_2.png"
                            alt="suicuplogo2"
                            visibleByDefault
                            disabledEffect
                        />
                        <Stack>
                            <Typography variant="h5" color={'#00BDD6'}>SUICUP</Typography>
                            <Typography color={'black'}>Sui Me a Coffee</Typography>
                        </Stack>
                    </Stack>
                    <Link
                        href={'/auth/login'}
                    >
                        <Button variant='contained' size='medium' sx={{ borderRadius: '1.25rem', width: '100px' }}>
                            Login
                        </Button>
                    </Link>
                </Container>
            </ToolbarStyle>
            {isOffset && <ToolbarShadowStyle />}
        </AppBar>
    );
}

export default function LandingPageLayout({ children }: Props) {
    return (
        <Stack sx={{ minHeight: 1 }}>
            <MainHeader />
            {children}
        </Stack>
    );
}