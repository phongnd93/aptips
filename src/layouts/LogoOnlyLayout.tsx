import { ReactNode } from 'react';
// @mui
import { styled } from '@mui/material/styles';
// components
import Logo from '../components/Logo';
import { Button, Container, Stack, Typography } from '@mui/material';
import Iconify from 'src/components/Iconify';

// ----------------------------------------------------------------------

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  left: 0,
  lineHeight: 0,
  width: theme.breakpoints.values.lg,
  maxWidth: theme.breakpoints.values.lg,
  position: 'relative',
  padding: theme.spacing(3, 3, 0),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(5, 5, 0),
  },
}));

// ----------------------------------------------------------------------

type Props = {
  children?: ReactNode;
};

export default function LogoOnlyLayout({ children }: Props)
{
  return (
    <>
      <Container
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Stack alignItems='center' justifyContent='start'>
          <Logo />
        </Stack>
        <Button variant='contained' href='mailto:phongnguyenduy93@gmail.com'>
          <Stack direction={'row'} spacing={1}>
            <Iconify icon={'mdi:email-open-heart-outline'} width={24} height={24} />
            <Typography component={'span'} variant='button'>Need help ? Email us</Typography>
          </Stack>
        </Button>
      </Container>
      {children}
    </>
  );
}
