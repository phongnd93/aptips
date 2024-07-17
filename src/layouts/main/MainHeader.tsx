// next
import { useRouter } from 'next/router';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { AppBar, Toolbar, Container, Stack } from '@mui/material';
// hooks
import useOffSetTop from '../../hooks/useOffSetTop';
import useResponsive from '../../hooks/useResponsive';
// utils
import cssStyles from '../../utils/cssStyles';
// config
import { HEADER } from '../../config';
// components
import Logo from '../../components/Logo';
//
import MenuDesktop from './MenuDesktop';
import MenuMobile from './MenuMobile';
import navConfig from './MenuConfig';
import AccountPopover from '../dashboard/header/AccountPopover';
import LanguagePopover from '../dashboard/header/LanguagePopover';
import CreateLinkButton from 'src/components/CreateLinkButton';

// ----------------------------------------------------------------------

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

// ----------------------------------------------------------------------

export default function MainHeader()
{
  // const isOffset = useOffSetTop(HEADER.MAIN_DESKTOP_HEIGHT);
  const isOffset = true;

  const theme = useTheme();

  const { pathname } = useRouter();

  const isDesktop = useResponsive('up', 'md');

  const isHome = pathname === '/dashboard';

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
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Stack direction='row' alignItems='center' justifyContent='start'>
            <Logo />
            {isDesktop && <MenuDesktop isOffset={isOffset} isHome={isHome} navConfig={navConfig} />}
          </Stack>
          {/* 
          PHONG: Hide theme version
          <Label color="info" sx={{ ml: 1 }}>
            v3.3.0
          </Label> */}

          {/* <Box sx={{ flexGrow: 1 }} /> */}



          {/* 
          PHONG:Hide purchase button
          <Button
            variant="contained"
            target="_blank"
            rel="noopener"
            href="https://material-ui.com/store/items/minimal-dashboard/"
          >
            Purchase Now
          </Button> */}

          <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
            <CreateLinkButton />
            <LanguagePopover />
            {/* <NotificationsPopover /> */}
            {/* <ContactsPopover /> */}
            <AccountPopover />
          </Stack>

          {!isDesktop && <MenuMobile isOffset={isOffset} isHome={isHome} navConfig={navConfig} />}
        </Container>
      </ToolbarStyle>

      {isOffset && <ToolbarShadowStyle />}
    </AppBar>
  );
}
