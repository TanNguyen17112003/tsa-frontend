import { Box, Typography, Stack, Select, MenuItem, TextField, InputAdornment } from '@mui/material';
import React from 'react';
import DateRangePickerTextField from 'src/components/date-range-picker-textfield';
import { SearchIcon } from 'lucide-react';
import { useRouter } from 'next/router';
import { orderStatusMap } from 'src/types/order';

interface OrderFilterProps {
  numberOfOrders: number;
}

const OrderFilter: React.FC<OrderFilterProps> = (props) => {
  const router = useRouter();
  const orderStatusList = ['Tất cả', ...Object.keys(orderStatusMap)];
  const [dateRange, setDateRange] = React.useState({
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-31')
  });
  const handleDateChange = React.useCallback((range: any) => {
    setDateRange(range);
  }, []);
  const handleReportStatusChange = React.useCallback(
    (status: string) => {
      const queryStatus =
        status === 'Tất cả'
          ? 'all'
          : orderStatusMap[status as keyof typeof orderStatusMap].toLowerCase();
      router.push({
        pathname: router.pathname,
        query: { ...router.query, status: queryStatus }
      });
    },
    [router, orderStatusMap]
  );
  return (
    <Box className='flex gap-2 items-center w-full'>
      <Stack direction='row' spacing={0.5} width={'15%'}>
        <Typography fontWeight={'bold'}>Số lượng đơn hàng:</Typography>
        <Typography fontWeight={'bold'}>{props.numberOfOrders}</Typography>
      </Stack>
      <TextField
        variant='outlined'
        placeholder='Tìm kiếm mã đơn'
        className='w-[20%]'
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <SearchIcon />
            </InputAdornment>
          )
        }}
      />
      <Stack direction={'row'} spacing={2} alignItems={'center'} width={'65%'}>
        <Box className='flex flex-col gap-1 w-[50%]'>
          <Typography fontWeight={'bold'}>Trạng thái</Typography>
          <Select
            defaultValue={orderStatusList[0]}
            onChange={(e) => handleReportStatusChange(e.target.value as string)}
          >
            {orderStatusList.map((status, index) => (
              <MenuItem key={index} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box className='flex flex-col gap-1'>
          <Typography fontWeight={'bold'}>Thời gian</Typography>
          <DateRangePickerTextField
            initialDateRange={dateRange}
            onChange={handleDateChange}
            labelHolder='Nhập thời gian đơn hàng'
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default OrderFilter;
