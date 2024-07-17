// @mui
import { styled } from '@mui/material/styles';
// layouts
import Layout from '../layouts';
import Page from '../components/Page';
import { Container, Grid, Stack, StackProps, useTheme } from '@mui/material';
import { AppWidgetSummary, AppAreaInstalled } from 'src/sections/@dashboard/general/app';
import useSettings from 'src/hooks/useSettings';
import useSuiAuth from 'src/hooks/useSuiAuth';
import { useEffect, useRef, useState } from 'react';
import UserServices from 'src/services/UserServices';
import TransactionServices from 'src/services/TransactionServices';
import { Donator, RevenueResponseDTO, Transaction } from '../@types/transaction';
import AppTopDonators from 'src/sections/@dashboard/general/app/AppTopDonators';
import TableReportData from '../sections/@dashboard/general/app/TableReportData';

Dashboard.getLayout = function getLayout(page: React.ReactElement)
{
  return <Layout variant="main">{page}</Layout>;
};

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

export default function Dashboard()
{
  const theme = useTheme();
  const { info } = useSuiAuth();
  const { themeStretch } = useSettings();
  const isInit = useRef(false);

  //Service
  const userSvc = new UserServices();
  const transSvc = new TransactionServices();

  const [total, setTotal] = useState<number>(0);
  const [donations, setDonations] = useState<number>(0);
  const [newDonators, setNewDonators] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [topDonators, setTopDonators] = useState<Donator[]>([]);
  const [revenue, setRevenue] = useState<RevenueResponseDTO>([]);

  useEffect(() =>
  {
    if (!isInit.current && info?.id)
    {
      initizalize();
    }
    return () =>
    {
      isInit.current = true;
    }
  }, [info]);

  const initizalize = async () =>
  {
    if (info?.id)
    {
      const donationResult = await userSvc.donation(info.id);
      const transactionResult = await transSvc.transactions(info.id);
      const topDotatorResult = await transSvc.topDonators(info.id, 10);
      const revenueResult = await transSvc.revenue(info.id);

      if (donationResult?.data)
      {
        const { value, num } = donationResult.data;
        setTotal(value);
        setDonations(num);
        setNewDonators(num);
      }

      setTransactions(transactionResult);
      setTopDonators(topDotatorResult);
      setRevenue(revenueResult);
    }
  }

  return (
    <Page title="Dashboard">
      <ContentStyle>
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <Grid container direction={'column'} spacing={1}>
                <Grid item xs={12} md={4}>
                  <AppWidgetSummary
                    title="Total SUI"
                    percent={total > 0 ? 100 : 0}
                    total={total}
                    chartColor={theme.palette.primary.main}
                    chartData={[5, 18, 12, 51, 68, 11, 39, 37, 27, 20]}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <AppWidgetSummary
                    title="Donations"
                    percent={donations > 0 ? 100 : 0}
                    total={donations}
                    chartColor={theme.palette.chart.blue[0]}
                    chartData={[20, 41, 63, 33, 28, 35, 50, 46, 11, 26]}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <AppWidgetSummary
                    title="New donators"
                    percent={newDonators > 0 ? 100 : 0}
                    total={newDonators}
                    chartColor={theme.palette.chart.red[0]}
                    chartData={[8, 9, 31, 8, 16, 37, 8, 33, 46, 31]}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={6} lg={8}>
              <AppAreaInstalled title='Revenue' data={revenue} />
            </Grid>

            <Grid item xs={12}>
              <AppTopDonators data={topDonators} />
            </Grid>

            <Grid item xs={12}>
              <TableReportData dataReport={transactions} />
            </Grid>
          </Grid>
        </Container>
      </ContentStyle>
    </Page>
  );
}

