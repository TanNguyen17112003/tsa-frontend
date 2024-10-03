import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import { initialOrderList } from 'src/types/order';
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { lineChartOptions } from 'src/utils/config-charts';

const PaymentMethodLineChart: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(2021);

  const handleYearChange = (event: SelectChangeEvent<number>) => {
    setSelectedYear(Number(event.target.value));
  };

  const paymentMethods: string[] = ['CASH', 'MOMO', 'CREDIT'];
  const ordersByPaymentMethod = paymentMethods.map((paymentMethod) => {
    return Array.from({ length: 12 }, (_, index) => {
      return initialOrderList.filter((order) => {
        const orderDate = new Date(Number(order.deliveryDate) * 1000);
        return (
          orderDate.getFullYear() === selectedYear &&
          orderDate.getMonth() === index &&
          order.paymentMethod === paymentMethod
        );
      }).length;
    });
  });

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
            {[2021, 2022, 2023].map((year) => (
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
