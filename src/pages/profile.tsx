// @mui
import { styled } from '@mui/material/styles';
// layouts
import Layout from '../layouts';
import Page from '../components/Page';
import { Button, Card, CardContent, Container, Grid, Input, OutlinedInput, Stack, StackProps, TextField, Typography, useTheme } from '@mui/material';
import { AppWidgetSummary, AppAreaInstalled, AppNewInvoice } from 'src/sections/@dashboard/general/app';
import useSettings from 'src/hooks/useSettings';
import AppTopContributors from 'src/sections/@dashboard/general/app/AppTopContributors';
import useSuiAuth from 'src/hooks/useSuiAuth';
import { useEffect, useRef, useState } from 'react';
import UserServices from 'src/services/UserServices';
import EmptyData from 'src/components/EmptyData';
import TransactionServices from 'src/services/TransactionServices';
import { Donator, RevenueResponseDTO, Transaction } from '../@types/transaction';
import AppTopDonators from 'src/sections/@dashboard/general/app/AppTopDonators';
import TableReportData from './TableReportData';
import { RHFEditor, RHFTextField, RHFUploadSingleFile } from 'src/components/hook-form';
import { FormConfig } from 'src/components/form/FormConfig';
import { set } from 'lodash';
import { use } from 'i18next';

const ContentStyle = styled((props: StackProps) => <Stack spacing={5} {...props} />)(
  ({ theme }) => ({
    margin: 'auto',
    textAlign: 'center',
    paddingTop: theme.spacing(15),
    paddingBottom: theme.spacing(1),
    alignContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.up('md')]: {
      margin: 'unset',
      textAlign: 'left',
    },
  })
);
// ----------------------------------------------------------------------
const LabelStyle = styled(Typography)(({ theme }) => ({
    ...theme.typography.subtitle2,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
  }));

Profile.getLayout = function getLayout(page: React.ReactElement)
  {
      return <Layout>{page}</Layout>;
  };

export default function Profile()
{
const { info } = useSuiAuth();
console.log("info:", info);
const userSvc = new UserServices();
const [fullName, setFullName] = useState<string>(info.fullName!);
const [about, setAbout] = useState<string>(info.about!);
// useEffect(() =>
//     {
//             userSvc.info(info.walletAddress!).then((res) =>
//             {
//                 setFullName(res.fullName!);
//                 setAbout(res.about!);
//             });
//     }, []);

const onChangeInfo = (e: any) => {
    userSvc.update({
        id: info?.id!,
        walletAddress: info?.walletAddress!,
        email: info?.email!,
        avatarUrl: info?.avatarUrl!,
        fullName: fullName,
        about: about
    }).then((res) => {
        console.log(res);
        setFullName(res.fullName!);
        setAbout(res.about!);  
    });
}
  return (
    <Page title="Home">
          <Container sx={{ mt: 20, mb: 5 }}>
                <Stack alignItems={'center'}>
                    <Card sx={{ maxWidth: 600 }}>
                            <Stack spacing={3}>
                                <Typography variant='h3' align='center'>
                                    Profile
                                </Typography>
                            </Stack>
                        <CardContent>
                            <Stack spacing={3}>
                            <OutlinedInput
                                color='info'
                                label='Full Name'
                                placeholder='Full Name'
                                fullWidth
                                value={fullName}
                                onChange={(e)=>{console.log("d:", e); setFullName(e.target.value)}}
                            />
                            <OutlinedInput
                                label='About'
                                rows={3}
                                placeholder='Say something nice...(optional)'
                                fullWidth
                                multiline
                                onChange={(e)=>{setAbout(e.target.value)}}
                                value={about}
                            />
                                <Button
                                    variant='contained'
                                    type='button'
                                    onClick={onChangeInfo}
                                >
                                    Save
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Stack>
            </Container>
    </Page>
  );
}
