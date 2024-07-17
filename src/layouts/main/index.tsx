import { ReactNode } from 'react';
// next
import { useRouter } from 'next/router';
// @mui
import { Box, Link, Container, Typography, Stack } from '@mui/material';
// components
import Logo from '../../components/Logo';
//
import MainHeader from './MainHeader';
import { LinkDonateProvider } from '../../contexts/ManagerLinkContext';

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode;
};

export default function MainLayout({ children }: Props)
{
  const { pathname } = useRouter();

  return (
    <Stack sx={{ minHeight: 1 }}>
      <MainHeader />
      <LinkDonateProvider NodeId=''>
        {children}
      </LinkDonateProvider>
      <Box sx={{ flexGrow: 1 }} />

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
