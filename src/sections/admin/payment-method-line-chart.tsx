import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Chart } from 'src/components/chart';
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { lineChartOptions } from 'src/utils/config-charts';
import { OrderDetail } from 'src/types/order';

interface PaymentMethodLineChartProps {
  orders: OrderDetail[];
}

const PaymentMethodLineChart: React.FC<PaymentMethodLineChartProps> = ({ orders }) => {
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
      return Array.from({ length: 12 }, (_, index) => {
        return orders.filter((order) => {
          const orderDate = new Date(Number(order.deliveryDate) * 1000);
          return (
            orderDate.getFullYear() === selectedYear &&
            orderDate.getMonth() === index &&
            order.paymentMethod === paymentMethod
          );
        }).length;
      });
    });
  }, [orders, selectedYear]);

  const series = paymentMethods.map((paymentMethod, index) => ({
    name: paymentMethod,
    data: ordersByPaymentMethod[index]
  }));

  return (
    <Box>
      <Box display='flex' justifyContent='flex-end' mb={2}>
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
      <Chart options={lineChartOptions} series={series} type='line' height={350} />
    </Box>
  );
};

export default PaymentMethodLineChart;
