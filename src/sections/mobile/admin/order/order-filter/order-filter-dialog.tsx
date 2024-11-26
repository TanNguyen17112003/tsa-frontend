import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Divider,
  Slide,
  SlideProps,
  SelectChangeEvent
} from '@mui/material';
import DateRangePickerTextField from 'src/components/date-range-picker-textfield';
import { AddressData } from '@utils';
import { orderStatusMap } from 'src/types/order';

interface MobileOrderFilterDialogProps {
  open: boolean;
  onClose: () => void;
  selectedDormitory: string;
  selectedBuilding: string;
  selectedRoom: string;
  selectedStatus: string;
  dateRange: { startDate: Date | undefined; endDate: Date | undefined };
  onDormitoryChange: (event: SelectChangeEvent<string>) => void;
  onBuildingChange: (event: SelectChangeEvent<string>) => void;
  onRoomChange: (event: SelectChangeEvent<string>) => void;
  onDateChange: (dateRange: { startDate?: Date; endDate?: Date }) => void;
  onStatusChange: (event: SelectChangeEvent<string>) => void;
  onResetFilters: () => void;
  onApplyFilters: () => void;
}

const Transition = React.forwardRef(function Transition(
  props: SlideProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />;
});

const MobileOrderFilterDialog: React.FC<MobileOrderFilterDialogProps> = ({
  open,
  onClose,
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
  onApplyFilters
}) => {
  const orderStatusList = Object.keys(orderStatusMap);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='sm'
      fullWidth
      TransitionComponent={Transition}
      sx={{
        '& .MuiDialog-paper': {
          position: 'fixed',
          bottom: 0,
          margin: 0,
          width: '100%',
          height: '60vh',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16
        }
      }}
    >
      <DialogTitle className='self-center mb-2'>Bộ lọc nâng cao</DialogTitle>
      <DialogContent sx={{ maxHeight: '50vh', overflowY: 'auto' }}>
        <Stack spacing={3}>
          <FormControl variant='filled' fullWidth>
            <InputLabel>Trạng thái</InputLabel>
            <Select value={selectedStatus} onChange={onStatusChange}>
              <MenuItem value=''>Tất cả</MenuItem>
              {orderStatusList.map((status) => (
                <MenuItem
                  key={status}
                  value={orderStatusMap[status as keyof typeof orderStatusMap]}
                >
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant='filled' fullWidth>
            <InputLabel>Kí túc xá</InputLabel>
            <Select value={selectedDormitory} onChange={onDormitoryChange}>
              {AddressData.dormitories.map((dormitory) => (
                <MenuItem key={dormitory} value={dormitory}>
                  {`Khu ${dormitory}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {selectedDormitory && (
            <FormControl variant='filled' fullWidth>
              <InputLabel>Tòa nhà</InputLabel>
              <Select value={selectedBuilding} onChange={onBuildingChange}>
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
            <FormControl variant='filled' fullWidth>
              <InputLabel>Phòng</InputLabel>
              <Select value={selectedRoom} onChange={onRoomChange}>
                {AddressData.rooms.map((room) => (
                  <MenuItem key={room} value={room}>
                    {room}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <DateRangePickerTextField
            initialDateRange={{
              startDate: dateRange.startDate || undefined,
              endDate: dateRange.endDate || undefined
            }}
            onChange={onDateChange}
            labelHolder='Nhập thời gian giao đơn hàng'
          />
        </Stack>
      </DialogContent>
      <DialogActions className='flex items-center justify-between pb-5'>
        <Button onClick={onResetFilters} color='error'>
          Xóa lọc
        </Button>
        <Button onClick={onApplyFilters} color='primary' variant='contained'>
          Áp dụng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MobileOrderFilterDialog;
