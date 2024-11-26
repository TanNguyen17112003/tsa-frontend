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
import { userStatusMap } from 'src/types/user';

interface MobileStaffFilterDialogProps {
  open: boolean;
  onClose: () => void;
  selectedStatus: string;
  dateRange: { startDate: Date | undefined; endDate: Date | undefined };
  onDateChange: (dateRange: { startDate?: Date; endDate?: Date }) => void;
  onStatusChange: (event: SelectChangeEvent<string>) => void;
  onResetFilters: () => void;
  onApplyFilters: (filters: {
    status: string;
    dateRange: { startDate: Date | undefined; endDate: Date | undefined };
  }) => void;
}

const Transition = React.forwardRef(function Transition(
  props: SlideProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />;
});

const MobileStaffFilterDialog: React.FC<MobileStaffFilterDialogProps> = ({
  open,
  onClose,
  selectedStatus,
  dateRange,
  onDateChange,
  onStatusChange,
  onResetFilters,
  onApplyFilters
}) => {
  const [localStatus, setLocalStatus] = useState<string>(selectedStatus);
  const [localDateRange, setLocalDateRange] = useState<{
    startDate: Date | undefined;
    endDate: Date | undefined;
  }>(dateRange);

  useEffect(() => {
    setLocalStatus(selectedStatus);
    setLocalDateRange(dateRange);
  }, [selectedStatus, dateRange]);

  const handleLocalStatusChange = (event: SelectChangeEvent<string>) => {
    setLocalStatus(event.target.value);
  };

  const handleLocalDateChange = (range: { startDate?: Date; endDate?: Date }) => {
    setLocalDateRange({
      startDate: range.startDate || undefined,
      endDate: range.endDate || undefined
    });
  };

  const handleApplyFilters = () => {
    onApplyFilters({ status: localStatus, dateRange: localDateRange });
    onClose();
  };

  const handleResetFilters = () => {
    setLocalStatus('all');
    setLocalDateRange({ startDate: undefined, endDate: undefined });
    onResetFilters();
  };

  const userStatusList = Object.keys(userStatusMap);

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
            <Select value={localStatus} onChange={handleLocalStatusChange}>
              <MenuItem value='all'>Tất cả</MenuItem>
              {userStatusList.map((status) => (
                <MenuItem key={status} value={userStatusMap[status as keyof typeof userStatusMap]}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <DateRangePickerTextField
            initialDateRange={localDateRange}
            onChange={handleLocalDateChange}
            labelHolder='Nhập thời gian giao đơn hàng'
          />
        </Stack>
      </DialogContent>
      <DialogActions className='flex items-center justify-between pb-5'>
        <Button onClick={handleResetFilters} color='error'>
          Xóa lọc
        </Button>
        <Button onClick={handleApplyFilters} color='primary' variant='contained'>
          Áp dụng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MobileStaffFilterDialog;
