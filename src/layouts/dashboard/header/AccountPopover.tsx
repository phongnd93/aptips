import { useSnackbar } from 'notistack';
import { useState } from 'react';
// next
import { useRouter } from 'next/router';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Button, IconButton } from '@mui/material';
// routes
import { PATH_DASHBOARD, PATH_AUTH, SUI_DONA_PATH } from '../../../routes/paths';
// hooks
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import MyAvatar from '../../../components/MyAvatar';
import MenuPopover from '../../../components/MenuPopover';
import { IconButtonAnimate } from '../../../components/animate';
import useSuiAuth from 'src/hooks/useSuiAuth';
import { requestSuiFromFaucet, shortenSuiAddress } from '@polymedia/suits';
import Iconify from 'src/components/Iconify';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------

// const MENU_OPTIONS = [
//   {
//     label: 'Home',
//     linkTo: '/',
//   },
//   {
//     label: 'Profile',
//     linkTo: PATH_DASHBOARD.user.profile,
//   },
//   {
//     label: 'Settings',
//     linkTo: PATH_DASHBOARD.user.account,
//   },
// ];

// ----------------------------------------------------------------------

export default function AccountPopover()
{
  const router = useRouter();

  const { NETWORK, balances, user, wallet, logout, fetchAccountBalance, info } = useSuiAuth();

  const isMountedRef = useIsMountedRef();

  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState<HTMLElement | null>(null);

  const [requesting, setRequesting] = useState(false);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) =>
  {
    setOpen(event.currentTarget);
  };

  const handleClose = () =>
  {
    setOpen(null);
  };

  const handleLogout = async () =>
  {
    try
    {
      await logout();
      router.replace('dashboard');

      if (isMountedRef.current)
      {
        handleClose();
      }
    } catch (error)
    {
      console.error(error);
      enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  };
  const handleBuySuiClick = async () =>
  {
    if (user || wallet)
    {
      setRequesting(true);
      await requestSuiFromFaucet(NETWORK, user?.userAddr || wallet?.address);
      setTimeout(async () =>
      {
        await fetchAccountBalance(user?.userAddr || wallet?.address);
        setRequesting(false);
      }, 3000);
    }
  }

  return (
    <>
      <IconButtonAnimate
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <MyAvatar />
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          {
            info?.fullName && <Typography variant="subtitle2" noWrap>
              {info.fullName}
            </Typography>
          }
          <Typography variant='body2' noWrap>{shortenSuiAddress(user?.userAddr || wallet?.address, 6, 15, '...', '_wallet_')}</Typography>
          {
            wallet?.label && <Typography
              variant="body2"
              sx={{ color: 'text.secondary' }} noWrap align='center' alignContent={'baseline'} alignSelf={'center'}>
              {wallet.label}
            </Typography>
          }
          <Stack direction={'row'} justifyContent={'space-between'} justifyItems={'baseline'}>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary' }} noWrap align='center' alignContent={'baseline'} alignSelf={'center'}>
              SUI: {balances}
            </Typography>
            <LoadingButton
              variant='outlined'
              color='warning'
              onClick={handleBuySuiClick}
              title='Buy SUI (Request Sui From Faucet)'
              loading={requesting}>
              <Iconify icon={'token-branded:sui'} />
            </LoadingButton>
          </Stack>
        </Box>
        {/* 
        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <NextLink key={option.label} href={option.linkTo} passHref>
              <MenuItem key={option.label} onClick={handleClose}>
                {option.label}
              </MenuItem>
            </NextLink>
          ))}
        </Stack> */}

        <Divider sx={{ borderStyle: 'dashed' }} />
        <MenuItem href={`${PATH_DASHBOARD.user.profile}`} sx={{ m: 1 }} 
          onClick={() =>
          {
            router.push('/profile');
          }}
        >
          Profile
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </MenuPopover>
    </>
  );
}
