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
import { AddressData } from '@utils';
import DateRangePickerTextField from 'src/components/date-range-picker-textfield';
import { orderStatusMap } from 'src/types/order';
import { useDialog } from '@hooks';
import { useResponsive } from 'src/utils/use-responsive';
import MobileOrderFilterDialog from './order-filter-dialog';

interface OrderFilterProps {
  selectedDormitory: string;
  selectedBuilding: string;
  selectedRoom: string;
  selectedStatus: string;
  dateRange: { startDate: Date | null; endDate: Date | null };
  onDormitoryChange: (event: SelectChangeEvent<string>) => void;
  onBuildingChange: (event: SelectChangeEvent<string>) => void;
  onRoomChange: (event: SelectChangeEvent<string>) => void;
  onDateChange: (range: { startDate?: Date; endDate?: Date }) => void;
  onStatusChange: (event: SelectChangeEvent<string>) => void;
  onResetFilters: () => void;
  numberOfOrders: number;
}

const OrderFilter: React.FC<OrderFilterProps> = ({
  selectedDormitory,
  selectedBuilding,
  selectedRoom,
  selectedStatus,
  dateRange,
  onDormitoryChange,
  onBuildingChange,
  onRoomChange,
  onDateChange,
  onStatusChange,
  onResetFilters,
  numberOfOrders
}) => {
  const { isMobile } = useResponsive();
  const mobileOrderFilterDialog = useDialog();

  const handleApplyFilters = () => {
    mobileOrderFilterDialog.handleClose();
  };

  return isMobile ? (
    <Box>
      <Button
        variant='outlined'
        onClick={mobileOrderFilterDialog.handleOpen}
        sx={{ justifyContent: 'center' }}
      >
        <TextalignCenter />
      </Button>
      <MobileOrderFilterDialog
        open={mobileOrderFilterDialog.open}
        onClose={mobileOrderFilterDialog.handleClose}
        selectedDormitory={selectedDormitory}
        selectedBuilding={selectedBuilding}
        selectedRoom={selectedRoom}
        selectedStatus={selectedStatus}
        dateRange={{
          startDate: dateRange.startDate ?? undefined,
          endDate: dateRange.endDate ?? undefined
        }}
        onDormitoryChange={onDormitoryChange}
        onBuildingChange={onBuildingChange}
        onRoomChange={onRoomChange}
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
        <FormControl variant='filled' className='w-1/5 rounded-none'>
          <InputLabel id='dormitory-select-label'>Kí túc xá</InputLabel>
          <Select
            labelId='dormitory-select-label'
            id='dormitory-select'
            value={selectedDormitory}
            onChange={onDormitoryChange}
          >
            {AddressData.dormitories.map((dormitory) => (
              <MenuItem key={dormitory} value={dormitory}>
                {`Khu ${dormitory}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {selectedDormitory && (
          <FormControl variant='filled' className='w-1/5 rounded-none'>
            <InputLabel id='building-select-label'>Tòa nhà</InputLabel>
            <Select
              labelId='building-select-label'
              id='building-select'
              value={selectedBuilding}
              onChange={onBuildingChange}
            >
              {AddressData.buildings[selectedDormitory as keyof typeof AddressData.buildings].map(
                (building) => (
                  <MenuItem key={building} value={building}>
                    {building}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>
        )}
        {selectedBuilding && (
          <FormControl variant='filled' className='w-1/5 rounded-none'>
            <InputLabel id='room-select-label'>Phòng</InputLabel>
            <Select
              labelId='room-select-label'
              id='room-select'
              value={selectedRoom}
              onChange={onRoomChange}
            >
              {AddressData.rooms.map((room) => (
                <MenuItem key={room} value={room}>
                  {room}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
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
            labelHolder='Nhập thời gian giao đơn hàng'
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
        <Typography fontWeight={'bold'}>Tổng số đơn hàng:</Typography>
        <Typography fontWeight={'bold'} color='red'>
          {numberOfOrders}
        </Typography>
      </Stack>
    </Box>
  );
};

export default OrderFilter;
