import React, { useCallback, useMemo, useState } from 'react';
import { Chart } from 'src/components/chart';
import { OrderDetail, OrderStatus } from 'src/types/order';
import {
  Box,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent
} from '@mui/material';
import { barChartOptions } from 'src/utils/config-charts';

interface StaffDetailOrderChartProps {
  orders: OrderDetail[];
}

const StaffDetailOrderChart: React.FC<StaffDetailOrderChartProps> = ({ orders }) => {
  const [selectedType, setSelectedType] = useState<'year' | 'month'>('year');
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'ALL'>('ALL');

  const currentYear = new Date().getFullYear();

  const handleTypeChange = useCallback(
    (event: SelectChangeEvent<'year' | 'month'>) => {
      setSelectedType(event.target.value as 'year' | 'month');
    },
    [setSelectedType]
  );

  const handleMonthChange = useCallback(
    (event: SelectChangeEvent<number>) => {
      setSelectedMonth(Number(event.target.value));
    },
    [setSelectedMonth]
  );

  const handleStatusChange = useCallback(
    (event: SelectChangeEvent<OrderStatus | 'ALL'>) => {
      setSelectedStatus(event.target.value as OrderStatus | 'ALL');
    },
    [setSelectedStatus]
  );

  const filteredData = useMemo(
    () =>
      orders.filter((order) => selectedStatus === 'ALL' || order.latestStatus === selectedStatus),
    [orders, selectedStatus]
  );

  let categories: string[] = [];
  let ordersCount: number[] = [];

  if (selectedType === 'year') {
    categories = Array.from(
      { length: 12 },
      (_, index) => (index + 1).toString().padStart(2, '0') + '/' + currentYear
    );
    ordersCount = Array.from({ length: 12 }, (_, index) => {
      return filteredData.filter((order) => {
        const orderDate = new Date(Number(order.deliveryDate) * 1000);
        return orderDate.getMonth() === index;
      }).length;
    });
  } else {
    const daysInMonth = new Date(currentYear, selectedMonth, 0).getDate();
    categories = Array.from(
      { length: daysInMonth },
      (_, index) =>
        (index + 1).toString().padStart(2, '0') +
        '/' +
        selectedMonth.toString().padStart(2, '0') +
        '/' +
        currentYear
    );
    ordersCount = Array.from({ length: daysInMonth }, (_, index) => {
      return filteredData.filter((order) => {
        const orderDate = new Date(Number(order.deliveryDate) * 1000);
        return orderDate.getMonth() + 1 === selectedMonth && orderDate.getDate() === index + 1;
      }).length;
    });
  }

  const series = [
    {
      name: 'Số lượng đơn hàng',
      data: ordersCount
    }
  ];

  return (
    <Card className='h-full'>
      <Box display='flex' justifyContent='flex-end' mb={2} gap={2} p={2}>
        <FormControl variant='filled' size='small' className='w-1/5'>
          <InputLabel id='type-select-label'>Chọn loại</InputLabel>
          <Select
            labelId='type-select-label'
            value={selectedType}
            onChange={handleTypeChange}
            label='Chọn loại'
          >
            <MenuItem value='year'>Năm</MenuItem>
            <MenuItem value='month'>Tháng</MenuItem>
          </Select>
        </FormControl>
        {selectedType === 'month' && (
          <FormControl variant='filled' size='small' className='w-1/5'>
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
        )}
        <FormControl variant='filled' size='small' className='w-1/5'>
          <InputLabel id='status-select-label'>Chọn trạng thái</InputLabel>
          <Select
            labelId='status-select-label'
            value={selectedStatus}
            onChange={handleStatusChange}
            label='Chọn trạng thái'
          >
            <MenuItem value='ALL'>Tất cả</MenuItem>
            <MenuItem value='CANCELED'>Đã hủy</MenuItem>
            <MenuItem value='DELIVERED'>Đã giao</MenuItem>
            <MenuItem value='PENDING'>Đang chờ xử lý</MenuItem>
            <MenuItem value='REJECTED'>Đã từ chối</MenuItem>
            <MenuItem value='IN_TRANSPORT'>Đang giao</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Chart
        options={{ ...barChartOptions, xaxis: { ...barChartOptions.xaxis, categories } }}
        series={series}
        type='bar'
        height={350}
      />
    </Card>
  );
};

export default StaffDetailOrderChart;
