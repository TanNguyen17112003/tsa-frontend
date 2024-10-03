import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import { initialOrderList } from 'src/types/order';
import { areaChartOptions } from 'src/utils/config-charts';
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

const RevenueChart: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);

  const handleMonthChange = (event: SelectChangeEvent<number>) => {
    setSelectedMonth(Number(event.target.value));
  };

  const filteredData = initialOrderList.filter((order) => {
    const orderDate = new Date(Number(order.deliveryDate) * 1000);
    return orderDate.getMonth() + 1 === selectedMonth;
  });

  const series = [
    {
      name: 'Doanh thu hàng tháng',
      data: filteredData.map((order) => ({
        x: new Date(Number(order.deliveryDate) * 1000).getDate(),
        y: order.shippingFee
      }))
    }
  ];

  const currentYear = new Date().getFullYear();

  return (
    <Box>
      <Box display='flex' justifyContent='flex-end' mb={2}>
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
      <Chart options={areaChartOptions} series={series} type='area' height={350} />
    </Box>
  );
};

export default RevenueChart;
