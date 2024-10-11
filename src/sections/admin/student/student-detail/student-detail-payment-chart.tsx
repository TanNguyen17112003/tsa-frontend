import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Chart } from 'src/components/chart';
import {
  Box,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography
} from '@mui/material';
import { donutChartOptions } from 'src/utils/config-charts';
import { OrderDetail } from 'src/types/order';

interface StudentDetailPaymentChartProps {
  orders: OrderDetail[];
}

const StudentDetailPaymentChart: React.FC<StudentDetailPaymentChartProps> = ({ orders }) => {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const handleYearChange = (event: SelectChangeEvent<number>) => {
    setSelectedYear(Number(event.target.value));
  };

  const getLatestList3Years = useCallback(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 3 }, (_, index) => currentYear - index);
  }, []);

  const paymentMethods: string[] = ['CASH', 'MOMO', 'CREDIT'];

  const ordersByPaymentMethod = useMemo(() => {
    return paymentMethods.map((paymentMethod) => {
      return orders.filter((order) => {
        const orderDate = new Date(Number(order.deliveryDate) * 1000);
        return orderDate.getFullYear() === selectedYear && order.paymentMethod === paymentMethod;
      }).length;
    });
  }, [orders, selectedYear]);

  const series = ordersByPaymentMethod;

  const chartOptions = useMemo(() => {
    return {
      ...donutChartOptions,
      labels: paymentMethods
    };
  }, [paymentMethods]);

  return (
    <Card className='h-full'>
      <Box display='flex' justifyContent='flex-end' mb={2} p={2}>
        <FormControl variant='filled' size='small' className='w-1/5'>
          <InputLabel id='year-select-label'>Chọn năm</InputLabel>
          <Select
            labelId='year-select-label'
            value={selectedYear}
            onChange={handleYearChange}
            label='Chọn năm'
          >
            {getLatestList3Years().map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Chart options={chartOptions} series={series} type='donut' height={350} />
      <Typography variant='h6' textAlign={'center'}>
        Phương thức thanh toán đơn hàng
      </Typography>
    </Card>
  );
};

export default StudentDetailPaymentChart;
