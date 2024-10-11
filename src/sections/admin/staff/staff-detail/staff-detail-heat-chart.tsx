import React from 'react';
import { Chart } from 'src/components/chart';
import { Box, Card, Typography } from '@mui/material';
import { AddressData } from '@utils';
import { OrderDetail } from 'src/types/order';
import { heatMapOptions } from 'src/utils/config-charts';

interface HeatMapData {
  dormitory: string;
  building: string;
  room: string;
  count: number;
}

interface StaffDetailHeatChartProps {
  orders: OrderDetail[];
}

const aggregateOrderData = (orders: OrderDetail[]): HeatMapData[] => {
  const heatMapData: HeatMapData[] = [];

  AddressData.dormitories.forEach((dormitory) => {
    AddressData.buildings[dormitory as keyof typeof AddressData.buildings].forEach((building) => {
      AddressData.rooms.forEach((room) => {
        const count = orders.filter(
          (order) =>
            order.dormitory === dormitory && order.building === building && order.room === room
        ).length;

        heatMapData.push({ dormitory, building, room, count });
      });
    });
  });

  return heatMapData;
};

const StaffDetailHeatChart: React.FC<StaffDetailHeatChartProps> = ({ orders }) => {
  const heatMapData = aggregateOrderData(orders);

  const series = AddressData.dormitories.map((dormitory) => {
    return {
      name: dormitory,
      data: AddressData.buildings[dormitory as keyof typeof AddressData.buildings]
        .map((building) => {
          return AddressData.rooms.map((room) => {
            const dataPoint = heatMapData.find(
              (data) =>
                data.dormitory === dormitory && data.building === building && data.room === room
            );
            return {
              x: `${building}-${room}`,
              y: dataPoint ? dataPoint.count : 0
            };
          });
        })
        .flat()
    };
  });

  return (
    <Card>
      <Box p={2}>
        <Typography variant='h6' align='center' gutterBottom>
          Biểu đồ nhiệt thể hiện số lượng đơn hàng của sinh viên theo địa chỉ
        </Typography>
        <Chart options={heatMapOptions} series={series} type='heatmap' height={300} />
      </Box>
    </Card>
  );
};

export default StaffDetailHeatChart;
