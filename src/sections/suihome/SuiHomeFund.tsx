import { m } from 'framer-motion';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Box, Container, Typography, Link, Stack } from '@mui/material';
// components
import { MotionViewport, varFade } from '../../components/animate';
import Iconify from 'src/components/Iconify';
import Image from 'src/components/Image';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(15),
  backgroundColor: '#00BDD612',
  [theme.breakpoints.up('md')]: {
    paddingBottom: theme.spacing(15),
  },
}));

// ----------------------------------------------------------------------

export default function SuiHomeFund()
{
  return (
    <RootStyle>
      <Container component={MotionViewport} maxWidth={'sm'} textAlign={'center'}>
        <Stack spacing={3} alignItems={'center'}>
          <m.div variants={varFade().inUp}>
            <Typography variant="h2" fontWeight={'700'}>
              Fund your creative
            </Typography>
            <Typography variant="h2" fontWeight={'700'}>
              work on <span style={{ color: '#00BDD6' }}>web3</span>
            </Typography>
          </m.div>
          <m.div variants={varFade().inDown}>
            <Typography fontSize={32} fontWeight={'400'}>
              Transparently, securely receive support from your fans
            </Typography>
          </m.div>
          <m.div variants={varFade().inLeft}>
            <Link href={'/dashboard'}>
              <Button variant='contained' sx={{ borderRadius: 10, px: 5, py: 2 }}>
                <Typography variant='h6'>Create Support</Typography>
              </Button>
            </Link>
          </m.div>
          <m.div variants={varFade().inRight}>
            <Typography fontSize={24}>It's free and takes less than a minute</Typography>
          </m.div>
        </Stack>
      </Container>
    </RootStyle>
  );
}
