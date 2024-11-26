import React from 'react';
import { Chart } from 'src/components/chart';
import { Card, Box, Typography } from '@mui/material';
import { radialChartOptions } from 'src/utils/config-charts';
import { DeliveryDetail, DeliveryStatus } from 'src/types/delivery';

const aggregateDeliveryDataByStatus = (
  deliveries: DeliveryDetail[]
): { status: DeliveryStatus; count: number }[] => {
  const statusCounts: { [key in DeliveryStatus]?: number } = {};

  deliveries.forEach((delivery) => {
    if (statusCounts[delivery.DeliveryStatusHistory[0].status]) {
      statusCounts[delivery.DeliveryStatusHistory[0].status]! += 1;
    } else {
      statusCounts[delivery.DeliveryStatusHistory[0].status] = 1;
    }
  });

  return Object.entries(statusCounts).map(([status, count]) => ({
    status: status as DeliveryStatus,
    count: count!
  }));
};

interface StaffDetailDelivertRadialChartProps {
  deliveries: DeliveryDetail[];
}

const StaffDetailDeliveryRadialChart: React.FC<StaffDetailDelivertRadialChartProps> = ({
  deliveries
}) => {
  const deliveryData = aggregateDeliveryDataByStatus(deliveries);

  const series = deliveryData.map((data) => data.count);
  const labels = deliveryData.map((data) => data.status);
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
          Biểu đồ phân bổ chuyến đi theo tình trạng
        </Typography>
        <Chart options={chartOptions} series={series} type='radialBar' height={350} />
      </Box>
    </Card>
  );
};

export default StaffDetailDeliveryRadialChart;
