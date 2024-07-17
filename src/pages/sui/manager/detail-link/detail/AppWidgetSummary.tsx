// @mui
import { alpha, useTheme, styled } from '@mui/material/styles';
import { Box, Card, Typography, Stack } from '@mui/material';
// utils
import { fNumber, fPercent } from '../../../../../utils/formatNumber';
// components
import Iconify from '../../../../../components/Iconify';
import ReactApexChart from '../../../../../components/chart';

// ----------------------------------------------------------------------

const IconWrapperStyle = styled('div')(({ theme }) => ({
  width: 24,
  height: 24,
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.success.main,
  backgroundColor: alpha(theme.palette.success.main, 0.16),
}));

// ----------------------------------------------------------------------

type Props = {
  title: string;
  total: number;
  percent: number;
  chartColor: string;
  chartData: number[];
  itemIcon?: string;
};

export default function AppWidgetSummary({ title, percent, total, chartColor, chartData, itemIcon }: Props) {
  const theme = useTheme();

  const chartOptions = {
    colors: [chartColor],
    chart: { sparkline: { enabled: true } },
    plotOptions: { bar: { columnWidth: '68%', borderRadius: 2 } },
    tooltip: {
      x: { show: false },
      y: {
        formatter: (seriesName: number | string) => fNumber(seriesName),
        title: {
          formatter: () => '',
        },
      },
      marker: { show: false },
    },
  };

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex' }}>
          <Typography variant="subtitle2" sx={{ width: '30%' }}>
            {title} 
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ ml: 2, mb: 1 }}>
              <IconWrapperStyle
                sx={{
                  ...(percent < 0 && {
                    color: 'error.main',
                    bgcolor: alpha(theme.palette.error.main, 0.16),
                  }),
                }}
              >
                <Iconify
                  width={12}
                  height={12}
                  icon={percent >= 0 ? 'eva:trending-up-fill' : 'eva:trending-down-fill'}
                />
              </IconWrapperStyle>
            <Typography component="span" variant="subtitle2">
              {percent > 0 && '+'}
              {fPercent(percent)}
              
            </Typography>
          </Stack>
        </Box>

        <Typography variant="h5" sx={{ pl: 1 }}>{fNumber(total)}</Typography>
      </Box>

      <ReactApexChart
        type="bar"
        series={[{ data: chartData }]}
        options={chartOptions}
        width={60}
        height={36}
      />
    </Card>
  );
}
