import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Chart from 'react-apexcharts';
import { initialOrderList } from 'src/types/order';
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { lineChartOptions } from 'src/utils/config-charts';
import { OrdersApi } from 'src/api/orders';
import useFunction from 'src/hooks/use-function';

const PaymentMethodLineChart: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const getOrdersApi = useFunction(OrdersApi.getOrders);

  const orders = useMemo(() => {
    return getOrdersApi.data || [];
  }, [getOrdersApi.data]);

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

  useEffect(() => {
    getOrdersApi.call({});
  }, []);
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
