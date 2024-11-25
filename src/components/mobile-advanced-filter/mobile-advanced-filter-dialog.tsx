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
  SlideProps
} from '@mui/material';
import DateRangePickerTextField from 'src/components/date-range-picker-textfield';
import { Filter } from 'src/types/filter';

interface MobileAdvancedFilterDialogProps {
  open: boolean;
  onClose: () => void;
  filters: Filter[];
}

const Transition = React.forwardRef(function Transition(
  props: SlideProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />;
});

const MobileAdvancedFilterDialog: React.FC<MobileAdvancedFilterDialogProps> = ({
  open,
  onClose,
  filters
}) => {
  const [localFilters, setLocalFilters] = useState<Filter[]>([]);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (index: number, value: any) => {
    const updatedFilters = [...localFilters];
    updatedFilters[index].value = value;
    setLocalFilters(updatedFilters);
  };

  const handleResetFilters = () => {
    const resetFilters = localFilters.map((filter) => ({
      ...filter,
      value: filter.type === 'select' ? '' : { startDate: null, endDate: null }
    }));
    setLocalFilters(resetFilters);
    onClose();
  };

  const handleApplyFilters = () => {
    localFilters.forEach((filter, index) => {
      filters[index].onChange(filter.value);
    });
    onClose();
  };

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
          {localFilters.map((filter, index) => (
            <Box key={index}>
              {filter.type === 'select' && (
                <FormControl variant='filled' fullWidth>
                  <InputLabel>{filter.title}</InputLabel>
                  <Select
                    value={filter.value}
                    onChange={(event) => handleFilterChange(index, event.target.value)}
                  >
                    {filter.options?.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              {filter.type === 'dateRange' && (
                <DateRangePickerTextField
                  initialDateRange={filter.value}
                  onChange={(range) => handleFilterChange(index, range)}
                  labelHolder={filter.title}
                />
              )}
              {index < localFilters.length - 1 && <Divider />}
            </Box>
          ))}
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

export default MobileAdvancedFilterDialog;
