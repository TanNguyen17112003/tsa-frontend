import { Box, Typography, Stack, Select, MenuItem, TextField, InputAdornment } from '@mui/material';
import React from 'react';
import DateRangePickerTextField from 'src/components/date-range-picker-textfield';
interface ReportFilterProps {
  statusList: string[];
  numberOfReports: number;
  status: string;
  setStatus: (status: string) => void;
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  setDateRange: (range: any) => void;
}

const ReportFilter: React.FC<ReportFilterProps> = (props) => {
  const handleDateChange = React.useCallback((range: any) => {
    props.setDateRange(range);
  }, []);
  return (
    <Box className='flex gap-2 items-center w-full justify-between'>
      <Stack direction='row' spacing={1} width={'15%'}>
        <Typography className='font-bold'>Số lượng khiếu nại:</Typography>
        <Typography className='font-bold'>{props.numberOfReports}</Typography>
      </Stack>
      <Stack direction={'row'} spacing={2} alignItems={'center'} width={'65%'}>
        <Box className='flex flex-col gap-2 w-[50%]'>
          <Typography className='font-bold'>Trạng thái</Typography>
          <Select
            defaultValue={props.statusList[0]}
            value={props.status}
            onChange={(e) => props.setStatus(e.target.value as string)}
          >
            {props.statusList.map((status, index) => (
              <MenuItem key={index} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box className='flex flex-col gap-2'>
          <Typography className='font-bold'>Thời gian</Typography>
          <DateRangePickerTextField
            initialDateRange={props.dateRange}
            onChange={handleDateChange}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default ReportFilter;
