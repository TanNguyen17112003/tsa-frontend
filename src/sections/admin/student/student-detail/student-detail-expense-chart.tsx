import React, { useEffect, useMemo, useState } from 'react';
// import { Chart } from 'src/components/chart';
import { Chart } from 'src/components/chart';
import { initialOrderList } from 'src/types/order';
import { areaChartOptions } from 'src/utils/config-charts';
import {
  Box,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent
} from '@mui/material';
import { OrdersApi } from 'src/api/orders';
import useFunction from 'src/hooks/use-function';

const StudentDetailExpenseChart: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const getOrdersApi = useFunction(OrdersApi.getOrders);
  const orders = useMemo(() => {
    return getOrdersApi.data || [];
  }, [getOrdersApi.data]);

  const handleMonthChange = (event: SelectChangeEvent<number>) => {
    setSelectedMonth(Number(event.target.value));
  };

  const filteredData = useMemo(() => {
    const filteredOrders = orders.filter((order) => {
      const orderDate = new Date(Number(order.deliveryDate) * 1000);
      const filterStatus = order.latestStatus === 'DELIVERED';
      return orderDate.getMonth() + 1 === selectedMonth && filterStatus;
    });

    const aggregatedData = new Map<number, number>();

    filteredOrders.forEach((order) => {
      const orderDate = new Date(Number(order.deliveryDate) * 1000).getDate();
      if (aggregatedData.has(orderDate)) {
        aggregatedData.set(orderDate, aggregatedData.get(orderDate)! + order.shippingFee);
      } else {
        aggregatedData.set(orderDate, order.shippingFee);
      }
    });

    return Array.from(aggregatedData.entries()).map(([date, totalShippingFee]) => ({
      x: date,
      y: totalShippingFee
    }));
  }, [orders, selectedMonth]);

  const series = [
    {
      name: 'Doanh thu hàng tháng',
      data: filteredData
    }
  ];

  const chartOptions = {
    ...areaChartOptions,
    yaxis: {
      title: {
        text: 'Chi phí (VNĐ)'
      }
    }
  };

  const currentYear = new Date().getFullYear();
  useEffect(() => {
    getOrdersApi.call({});
  }, []);

  return (
    <Card className='h-full'>
      <Box display='flex' justifyContent='flex-end' mb={2} p={2}>
        <FormControl variant='filled' size='small' className='w-[20%]'>
          <InputLabel id='month-select-label'>Chọn tháng</InputLabel>
          <Select
            labelId='month-select-label'
            value={selectedMonth}
            onChange={handleMonthChange}
            label='Chọn tháng'
          >
            {Array.from({ length: 12 }, (_, index) => (
              <MenuItem key={index + 1} value={index + 1}>
                {`${(index + 1).toString().padStart(2, '0')}/${currentYear}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Chart options={chartOptions} series={series} type='area' height={350} />
    </Card>
  );
};

export default StudentDetailExpenseChart;
