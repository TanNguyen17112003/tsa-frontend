import React from 'react';
import {
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  SelectChangeEvent,
  Box,
  Button
} from '@mui/material';
import { Filter, ArrowRotateLeft, TextalignCenter } from 'iconsax-react';
import DateRangePickerTextField from 'src/components/date-range-picker-textfield';
import { orderStatusMap } from 'src/types/order';
import { useDialog } from '@hooks';
import { useResponsive } from 'src/utils/use-responsive';
import MobileDeliveryFilterDialog from './delivery-filter-dialog';

interface DeliveryFilterProps {
  selectedStatus: string;
  dateRange: { startDate: Date | null; endDate: Date | null };
  onDateChange: (range: { startDate?: Date; endDate?: Date }) => void;
  onStatusChange: (event: SelectChangeEvent<string>) => void;
  onResetFilters: () => void;
  numberOfDeliveries: number;
}

const DeliveryFilter: React.FC<DeliveryFilterProps> = ({
  selectedStatus,
  dateRange,
  onDateChange,
  onStatusChange,
  onResetFilters,
  numberOfDeliveries
}) => {
  const { isMobile } = useResponsive();
  const mobileDeliveryFilterDialog = useDialog();

  const handleApplyFilters = (filters: {
    status: string;
    dateRange: { startDate: Date | undefined; endDate: Date | undefined };
  }) => {
    onStatusChange({ target: { value: filters.status } } as SelectChangeEvent<string>);
    onDateChange(filters.dateRange);
    mobileDeliveryFilterDialog.handleClose();
  };

  return isMobile ? (
    <Box>
      <Button
        variant='outlined'
        onClick={mobileDeliveryFilterDialog.handleOpen}
        sx={{ justifyContent: 'center' }}
      >
        <TextalignCenter />
      </Button>
      <MobileDeliveryFilterDialog
        open={mobileDeliveryFilterDialog.open}
        onClose={mobileDeliveryFilterDialog.handleClose}
        selectedStatus={selectedStatus}
        dateRange={{
          startDate: dateRange.startDate ?? undefined,
          endDate: dateRange.endDate ?? undefined
        }}
        onDateChange={onDateChange}
        onStatusChange={onStatusChange}
        onResetFilters={onResetFilters}
        onApplyFilters={handleApplyFilters}
      />
    </Box>
  ) : (
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
            {Object.keys(orderStatusMap).map((status) => (
              <MenuItem key={status} value={orderStatusMap[status as keyof typeof orderStatusMap]}>
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
                startDate: dateRange.startDate ?? undefined,
                endDate: dateRange.endDate ?? undefined
              })
            }
            labelHolder='Nhập thời gian tạo chuyến đi'
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
        <Typography fontWeight={'bold'}>Tổng số chuyến đi:</Typography>
        <Typography fontWeight={'bold'} color='red'>
          {numberOfDeliveries}
        </Typography>
      </Stack>
    </Box>
  );
};

export default DeliveryFilter;
