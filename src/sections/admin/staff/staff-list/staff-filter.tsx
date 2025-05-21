import React, { useState } from 'react';
import {
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  SelectChangeEvent,
  Box
} from '@mui/material';
import { Filter, ArrowRotateLeft } from 'iconsax-react';
import DateRangePickerTextField from 'src/components/date-range-picker-textfield';
import { staffStatusMap, userStatusMap } from 'src/types/user';

interface StaffFilterProps {
  selectedStatus: string;
  dateRange: { startDate: Date | null; endDate: Date | null };
  onDateChange: (range: { startDate: Date | null; endDate: Date | null }) => void;
  onStatusChange: (event: SelectChangeEvent<string>) => void;
  onResetFilters: () => void;
  numberOfStaff: number;
}

const StaffFilter: React.FC<StaffFilterProps> = ({
  selectedStatus,
  dateRange,
  onDateChange,
  onStatusChange,
  onResetFilters,
  numberOfStaff
}) => {
  const orderStatusList = Object.keys(staffStatusMap);
  return (
    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
      <Stack direction={'row'} className='w-4/5 my-6'>
        <Stack direction={'row'} alignItems={'center'} gap={1} className='border opacity-60 px-4'>
          <Filter size={20} variant='Bold' />
          <Typography variant='subtitle2'>Lọc theo</Typography>
        </Stack>

        <FormControl variant='filled' className='w-1/5 rounded-none'>
          <InputLabel id='status-select-label'>Trạng thái</InputLabel>
          <Select
            labelId='status-select-label'
            id='status-select'
            value={selectedStatus}
            onChange={onStatusChange}
          >
            <MenuItem value=''>Tất cả</MenuItem>
            {orderStatusList.map((status) => (
              <MenuItem key={status} value={userStatusMap[status as keyof typeof userStatusMap]}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Stack>
          <DateRangePickerTextField
            initialDateRange={{
              startDate: dateRange.startDate ?? undefined,
              endDate: dateRange.endDate ?? undefined
            }}
            onChange={(dateRange) =>
              onDateChange({
                startDate: dateRange.startDate ?? null,
                endDate: dateRange.endDate ?? null
              })
            }
            labelHolder='Nhập thời gian tạo tài khoản'
          />
        </Stack>
        <Stack
          direction={'row'}
          alignItems={'center'}
          gap={1}
          className='border px-4 text-red-500 cursor-pointer'
          onClick={onResetFilters}
        >
          <ArrowRotateLeft size={20} />
          <Typography variant='subtitle2' fontWeight={'bold'}>
            Xóa lọc
          </Typography>
        </Stack>
      </Stack>
      <Stack className='text-bold' direction={'row'} gap={1}>
        <Typography fontWeight={'bold'}>Tổng số nhân viến:</Typography>
        <Typography fontWeight={'bold'} color='red'>
          {numberOfStaff}
        </Typography>
      </Stack>
    </Box>
  );
};

export default StaffFilter;
