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
import { studenStatusMap, userStatusMap } from 'src/types/user';
import { AddressData } from '@utils';

interface StudentFilterProps {
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
  numberOfStudent: number;
}

const StudentFilter: React.FC<StudentFilterProps> = ({
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
  numberOfStudent
}) => {
  const orderStatusList = Object.keys(studenStatusMap);
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
        <Typography fontWeight={'bold'}>Tổng số người dùng:</Typography>
        <Typography fontWeight={'bold'} color='red'>
          {numberOfStudent}
        </Typography>
      </Stack>
    </Box>
  );
};

export default StudentFilter;
