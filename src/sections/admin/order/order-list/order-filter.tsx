import React, { useState } from 'react';
import {
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  SelectChangeEvent
} from '@mui/material';
import { Filter, ArrowRotateLeft } from 'iconsax-react';
import { AddressData } from '@utils';
import DateRangePickerTextField from 'src/components/date-range-picker-textfield';
import { orderStatusMap } from 'src/types/order';

interface OrderFilterProps {
  selectedDormitory: string;
  selectedBuilding: string;
  selectedRoom: string;
  selectedStatus: string;
  dateRange: { startDate: Date | null; endDate: Date | null };
  onDormitoryChange: (event: SelectChangeEvent<string>) => void;
  onBuildingChange: (event: SelectChangeEvent<string>) => void;
  onRoomChange: (event: SelectChangeEvent<string>) => void;
  onDateChange: (range: { startDate: Date | null; endDate: Date | null }) => void;
  onStatusChange: (event: SelectChangeEvent<string>) => void;
  onResetFilters: () => void;
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
  onResetFilters
}) => {
  const orderStatusList = Object.keys(orderStatusMap);
  return (
    <Stack direction={'row'} className='w-4/5 my-6'>
      <Stack direction={'row'} alignItems={'center'} gap={1} className='border opacity-60 px-4'>
        <Filter size={20} variant='Bold' />
        <Typography variant='subtitle2'>Lọc theo</Typography>
      </Stack>
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
            <MenuItem key={status} value={orderStatusMap[status as keyof typeof orderStatusMap]}>
              {status}
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
              startDate: dateRange.startDate ?? null,
              endDate: dateRange.endDate ?? null
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
  );
};

export default OrderFilter;
