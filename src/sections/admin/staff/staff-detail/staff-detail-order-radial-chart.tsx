import React from 'react';
import { Chart } from 'src/components/chart';
import { Card, Box, Typography } from '@mui/material';
import { OrderStatus } from 'src/types/order';
import { initialOrderList } from 'src/types/order';
import { radialChartOptions } from 'src/utils/config-charts';

const aggregateOrderDataByStatus = (): { status: OrderStatus; count: number }[] => {
  const statusCounts: { [key in OrderStatus]?: number } = {};

  initialOrderList.forEach((order) => {
    if (statusCounts[order.latestStatus]) {
      statusCounts[order.latestStatus]! += 1;
    } else {
      statusCounts[order.latestStatus] = 1;
    }
  });

  return Object.entries(statusCounts).map(([status, count]) => ({
    status: status as OrderStatus,
    count: count!
  }));
};

const StaffDetailOrderRadialChart: React.FC = () => {
  const orderData = aggregateOrderDataByStatus();

  const series = orderData.map((data) => data.count);
  const labels = orderData.map((data) => data.status);
  const chartOptions = {
    ...radialChartOptions,
    labels: labels,
    plotOptions: {
      ...radialChartOptions.plotOptions,
      total: {
        show: true,
        label: 'Total',
        formatter: function () {
          return series.reduce((a, b) => a + b, 0).toString();
        }
      }
    }
  };

  return (
    <Card className='h-full'>
      <Box p={2}>
        <Typography variant='h6' align='center' gutterBottom>
          Biểu đồ phân bổ đơn hàng theo tình trạng
        </Typography>
        <Chart options={chartOptions} series={series} type='radialBar' height={350} />
      </Box>
    </Card>
  );
};

export default StaffDetailOrderRadialChart;
