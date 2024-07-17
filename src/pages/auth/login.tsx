// next
// @mui
import { styled } from '@mui/material/styles';
import { Box, Stack, Container, Typography, Grid, Alert, Button, Popover, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from '@mui/material';
// routes
// hooks
import useResponsive from '../../hooks/useResponsive';
// guards
import GuestGuard from '../../guards/GuestGuard';
// components
import Page from '../../components/Page';
import Logo from '../../components/Logo';
import Image from '../../components/Image';
// sections
import useAptos from 'src/hooks/useAptos';
import { useState } from 'react';
import { AnyAptosWallet, groupAndSortWallets, isInstallRequired } from '@aptos-labs/wallet-adapter-core';
import { useWallet, WalletItem } from '@aptos-labs/wallet-adapter-react';
import { LoadingButton } from '@mui/lab';
import Iconify from '../../components/Iconify';
import { DialogAnimate } from 'src/components/animate';
import AptosLoginForm from '../../sections/auth/login/AptosLoginForm';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'center',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0),
}));

const TermAndPolicyStyle = styled('span')(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: theme.typography.fontWeightBold
}))

// ----------------------------------------------------------------------

export default function Login()
{
  // const { login } = useAptos();

  const mdUp = useResponsive('up', 'md');
  const { wallets = [] } = useWallet();

  const { aptosConnectWallets, availableWallets, installableWallets } =
    groupAndSortWallets(wallets);

  const hasAptosConnectWallets = !!aptosConnectWallets.length;
  const [open, setOpen] = useState(false);
  const handleClose = () =>
  {
    setOpen(false);
  };
  return (
    <GuestGuard>
      <Page title="Login">
        <RootStyle>
          <Grid
            container
            justifyContent={{ xs: 'center', md: 'space-between' }}
            sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Grid item xs={12} md={6} bgcolor={(theme) => theme.palette.background.paper}>
              <Container maxWidth="sm">
                <ContentStyle>
                  <Stack alignItems="center"><Logo /></Stack>
                  <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
                    <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
                      <Typography variant="h3" gutterBottom>
                        Create an account
                      </Typography>
                      <Typography sx={{ color: 'text.secondary' }}>
                        By creating an account, you agree to this app's <br />
                        <TermAndPolicyStyle>Terms</TermAndPolicyStyle> and <TermAndPolicyStyle>Privacy Policy</TermAndPolicyStyle>
                      </Typography>
                    </Box>
                  </Stack>
                  <AptosLoginForm />
                </ContentStyle>
              </Container>
            </Grid>

            {mdUp && (
              <Grid item xs={12} md={6} bgcolor={(theme) => theme.palette.background.neutral}>
                <Container>
                  <ContentStyle>
                    <Typography variant="h3" sx={{ px: 5, mt: 10 }}>
                      Welcome to Awesome!
                    </Typography>
                    <Typography variant="subtitle1" sx={{ px: 5, mb: 5 }}>
                      First thing first, let set you up with create account
                    </Typography>
                    <Stack>
                      <Image
                        visibleByDefault
                        disabledEffect
                        sx={{ zIndex: 2 }}
                        src="/imgs/login_left.png"
                        alt="login_left"
                      />
                      <Image
                        visibleByDefault
                        disabledEffect
                        sx={{ mt: '-5rem', zIndex: 1 }}
                        src="/imgs/oval.png"
                        alt="login_oval"
                      />
                    </Stack>
                  </ContentStyle>
                </Container>
              </Grid>
            )}
          </Grid>
        </RootStyle>
      </Page>
    </GuestGuard>
  );
}