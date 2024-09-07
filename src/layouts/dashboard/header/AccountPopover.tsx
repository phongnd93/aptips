import { useSnackbar } from 'notistack';
import { useState } from 'react';
// next
import { useRouter } from 'next/router';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import MyAvatar from '../../../components/MyAvatar';
import MenuPopover from '../../../components/MenuPopover';
import { IconButtonAnimate } from '../../../components/animate';
import { shortenSuiAddress } from '@polymedia/suits';
import { LoadingButton } from '@mui/lab';
import { DisplayLogo } from 'src/components/DisplayLogo';
import { MAIN_CHAIN } from 'src/config';
import useChainAuth from 'src/hooks/useChainAuth';

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

  const { balances, wallet, requestTokenFromFaucet, logout, fetchAccountBalance, info } = useChainAuth();

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

  const handleBuyTokenClick = async () =>
  {
    if (wallet?.address)
    {
      setRequesting(true);
      await requestTokenFromFaucet();
      setTimeout(async () =>
      {
        await fetchAccountBalance(wallet?.address);
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
          <Typography variant='body2' noWrap>{shortenSuiAddress(wallet?.address, 6, 15, '...', '_wallet_')}</Typography>
          {
            // user?. && <Typography
            //   variant="body2"
            //   sx={{ color: 'text.secondary' }} noWrap align='center' alignContent={'baseline'} alignSelf={'center'}>
            //   {wallet.label}
            // </Typography>
          }
          <Stack direction={'row'} justifyContent={'space-between'} justifyItems={'baseline'}>
            <Stack direction={'row'} alignItems={'center'} gap={2}>
              <Typography variant='h6'>{MAIN_CHAIN} : </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary' }} noWrap>
                {balances}
              </Typography></Stack>
            <LoadingButton
              variant='outlined'
              color='primary'
              onClick={handleBuyTokenClick}
              title={`Buy ${MAIN_CHAIN} (Request ${MAIN_CHAIN} From Faucet)`}
              loading={requesting}>
              <DisplayLogo />
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
        <MenuItem onClick={logout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </MenuPopover>
    </>
  );
}
