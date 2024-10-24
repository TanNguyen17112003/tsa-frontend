import React from 'react';
import { Box, Typography, Stack, TextField, InputAdornment } from '@mui/material';
import { SearchIcon } from 'lucide-react';
import AdvancedFilter from 'src/components/advanced-filter/advanced-filter';
import { Filter } from 'src/types/filter';

interface OrderFilterProps {
  statusList: string[];
  numberOfOrders: number;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  setDateRange: (range: any) => void;
}

const OrderFilter: React.FC<OrderFilterProps> = (props) => {
  const orderStatusList = [
    'Tất cả',
    'Đã giao',
    'Đã hủy',
    'Đang giao',
    'Đã xác nhận',
    'Đang chờ xử lý',
    'Đã từ chối'
  ];

  const handleDateChange = React.useCallback((range: any) => {
    props.setDateRange(range);
  }, []);

  const handleStatusChange = React.useCallback((status: string) => {
    props.setSelectedStatus(status);
  }, []);

  const filters: Filter[] = [
    {
      type: 'select',
      title: 'Trạng thái',
      value: props.selectedStatus,
      onChange: handleStatusChange,
      options: orderStatusList.map((status) => ({
        label: status,
        value: status
      }))
    },
    {
      type: 'dateRange',
      title: 'Nhập thời gian giao đơn hàng',
      value: props.dateRange,
      onChange: handleDateChange
    }
  ];

  return (
    <Box className='flex justify-between'>
      <Box className='flex gap-5 items-center w-full'>
        <Stack direction='row' spacing={0.5}>
          <Typography fontWeight={'bold'}>Số lượng đơn hàng:</Typography>
          <Typography fontWeight={'bold'}>{props.numberOfOrders}</Typography>
        </Stack>
        <TextField
          variant='outlined'
          placeholder='Tìm kiếm mã đơn'
          className='w-[20%]'
          InputProps={{
            endAdornment: (
              <InputAdornment position='end' className='cursor-pointer'>
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
      </Box>
      <AdvancedFilter filters={filters} />
    </Box>
  );
};

export default OrderFilter;
