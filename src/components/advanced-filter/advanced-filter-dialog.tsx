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
  Divider
} from '@mui/material';
import DateRangePickerTextField from 'src/components/date-range-picker-textfield';
import { Filter } from 'src/types/filter';

interface AdvancedFilterDialogProps {
  open: boolean;
  onClose: () => void;
  filters: Filter[];
}

const AdvancedFilterDialog: React.FC<AdvancedFilterDialogProps> = ({ open, onClose, filters }) => {
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
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Bộ lọc nâng cao</DialogTitle>
      <DialogContent>
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
      <DialogActions>
        <Button onClick={handleResetFilters} color='secondary'>
          Xóa lọc
        </Button>
        <Button onClick={handleApplyFilters} color='primary'>
          Áp dụng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdvancedFilterDialog;
