import { Box, Typography, Stack, Select, MenuItem, TextField, InputAdornment } from '@mui/material';
import React from 'react';
import DateRangePickerTextField from 'src/components/date-range-picker-textfield';
import { SearchIcon } from 'lucide-react';

function ReportFilter() {
  const orderStatusList = ['Đã giao', 'Đang giao', 'Đã hủy'];
  const [dateRange, setDateRange] = React.useState({
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-31')
  });
  const handleDateChange = React.useCallback((range: any) => {
    setDateRange(range);
  }, []);
  return (
    <Box className='flex gap-2 items-center w-full justify-between'>
      <Stack direction='row' spacing={1} width={'15%'}>
        <Typography className='font-bold'>Số lượng khiếu nại:</Typography>
        <Typography className='font-bold'>15</Typography>
      </Stack>
      <Stack direction={'row'} spacing={2} alignItems={'center'} width={'65%'}>
        <Box className='flex flex-col gap-2 w-[50%]'>
          <Typography className='font-bold'>Trạng thái</Typography>
          <Select defaultValue={orderStatusList[0]}>
            {orderStatusList.map((status, index) => (
              <MenuItem key={index} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box className='flex flex-col gap-2'>
          <Typography className='font-bold'>Thời gian</Typography>
          <DateRangePickerTextField initialDateRange={dateRange} onChange={handleDateChange} />
        </Box>
      </Stack>
    </Box>
  );
}

export default ReportFilter;
