import merge from 'lodash/merge';
import { useMemo, useState } from 'react';
// @mui
import { Card, CardHeader, Box, TextField, Typography, Stack, styled } from '@mui/material';
// components
import ReactApexChart, { BaseOptionChart } from '../../../../../components/chart';
import EmptyData from 'src/components/EmptyData';
import { RevenueItem, RevenueResponseDTO } from 'src/@types/transaction';
import { CardContent } from '@mui/material';

// ----------------------------------------------------------------------

const EmptyDataContainerStyle = styled(Stack)(({ theme }) => ({
  left: 0,
  top: 0,
  zIndex: 10,
  position: 'absolute',
  width: '100%',
  height: '100%',
  paddingY: theme.spacing(5)
}));

type AppAreaInstalledProps = {
  title: string,
  data: RevenueResponseDTO
}

export default function AppAreaInstalled({ title, data }: AppAreaInstalledProps)
{
  const [seriesData, setSeriesData] = useState(0);
  const temData: RevenueResponseDTO = [{
    source: {
      id: 0,
      linkId: 0,
      utmSource: 'zalo'
    },
    totalRevenueByMonthList: [{
      year: 2024,
      month: 5,
      revenue: 30
    },
    {
      year: 2024,
      month: 4,
      revenue: 15
    }, {
      year: 2024,
      month: 3,
      revenue: 60
    },
    {
      year: 2024,
      month: 2,
      revenue: 33
    },
    {
      year: 2024,
      month: 1,
      revenue: 87
    }]
  },
  {
    source: {
      id: 1,
      linkId: 0,
      utmSource: 'facebook'
    },
    totalRevenueByMonthList: [{
      year: 2024,
      month: 5,
      revenue: 31
    },
    {
      year: 2024,
      month: 4,
      revenue: 19
    }, {
      year: 2024,
      month: 3,
      revenue: 50
    },
    {
      year: 2024,
      month: 2,
      revenue: 35
    },
    {
      year: 2024,
      month: 1,
      revenue: 10
    }]
  }];

  const CHART_DATA = [
    {
      year: 2019,
      data: [
        { name: 'Facebook', data: [10, 32] },
        // { name: 'Twitter', data: [10, 34, 13, 56, 77, 88, 99, 77, 45] },
        // { name: 'Zalo', data: [12, 3, 15, 70, 79, 85, 90, 77, 45] },
      ],
    },
    {
      year: 2020,
      data: [
        { name: 'Asia', data: [148, 91, 69, 62, 49, 51, 35, 41, 10] },
        { name: 'America', data: [45, 77, 99, 88, 77, 56, 13, 34, 10] },
      ],
    },
  ];

  const chartData = useMemo(() =>
  {
    const yearArr: { year?: number, data?: { name: string, data: number[] }[] }[] = [];
    data?.forEach(d =>
    {
      const item: any = {};
      if (d?.totalRevenueByMonthList?.length)
      {
        const years = new Set(d.totalRevenueByMonthList.map(r => r.year)).values().toArray().sort((a: number, b: number) => (a - b));
        years.forEach((y: number) =>
        {
          let yearIndex = yearArr.findIndex(yr => yr.year === y);
          if (yearIndex === -1) yearArr.push({ year: y, data: [] });
          yearIndex = yearArr.findIndex(yr => y === yr.year);

          const yearData = d.totalRevenueByMonthList.filter(r => r.year);
          const yData = [];
          const minMonth = yearData.sort((a, b) => a.month - b.month)[0];
          for (let index = 0; index <= 11; index++)
          {
            const monthData = yearData.find(m => m.month === index + 1);
            if (monthData) yData[index] = monthData.revenue;
            else if (minMonth?.month > index) yData[index] = 0;
          }
          item[d.source.utmSource] = { [y]: yData };
          yearArr[yearIndex].data.push({ name: d.source.utmSource, data: yData });
        });
      }
    });
    // if (yearArr?.length) setSeriesData(yearArr[0].year);
    return yearArr;
  }, [data]);

 
  if (chartData?.length && !seriesData) { setSeriesData(chartData[0].year); }

  const handleChangeSeriesData = (event: React.ChangeEvent<HTMLInputElement>) =>
  {
    setSeriesData(Number(event.target.value));
  };

  const chartOptions = merge(BaseOptionChart(), {
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    },
  });

  return (
    <Card sx={{ height: '95%' }}>
      <CardHeader
        title={title || 'Area Installed'}
        // subheader="(+43%) than last year"
        action={
          <>
            {chartData?.length > 0 && <TextField
              select
              fullWidth
              value={seriesData}
              SelectProps={{ native: true }}
              onChange={handleChangeSeriesData}
              sx={{
                '& fieldset': { border: '0 !important' },
                '& select': {
                  pl: 1,
                  py: 0.5,
                  pr: '24px !important',
                  typography: 'subtitle2',
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 0.75,
                  bgcolor: 'background.neutral',
                },
                '& .MuiNativeSelect-icon': {
                  top: 4,
                  right: 0,
                  width: 20,
                  height: 20,
                },
              }}
            >
              {chartData.map((option) => (
                <option key={option.year} value={option.year}>
                  {option.year}
                </option>
              ))}
            </TextField>}
          </>
        }
      />

        {chartData.map((item) => (
          <Box key={item.year} sx={{ mx: 3 }} dir="ltr">
            {item.year === seriesData && (
              <ReactApexChart type="line" series={item.data} options={chartOptions} height={250} />
            )}
          </Box>
        ))}
        {!chartData?.length && (
            <EmptyDataContainerStyle justifyContent={'center'} alignContent={'center'} alignItems={"center"}>
                <Box className={'background'} sx={{ opacity: 0.7, background: (theme) => theme.palette.background.default }} width={'100%'} height={'100%'}></Box>
                <Stack sx={{ position: 'absolute' }} justifyContent={'center'} alignContent={'center'} alignItems={"center"} spacing={2}>
                    <Typography variant="h5">No data revenue</Typography>
                </Stack>
            </EmptyDataContainerStyle>
        )}
    </Card>
  );
}
