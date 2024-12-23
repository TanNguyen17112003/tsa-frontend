import { Box, Typography, Stack } from '@mui/material';
import React from 'react';
import AdvancedFilter from 'src/components/advanced-filter/advanced-filter';
import { Filter } from 'src/types/filter';
import { statusMap } from 'src/types/report';

interface ReportFilterProps {
  statusList: string[];
  numberOfReports: number;
  status: string;
  setStatus: (status: string) => void;
  dateRange: {
    startDate: Date | null;
    endDate: Date | null;
  };
  setDateRange: (range: any) => void;
}

const ReportFilter: React.FC<ReportFilterProps> = (props) => {
  const handleDateChange = React.useCallback((range: any) => {
    props.setDateRange(range);
  }, []);

  const handleStatusChange = React.useCallback((status: string) => {
    props.setStatus(statusMap[status as keyof typeof statusMap]);
  }, []);

  const filters: Filter[] = [
    {
      type: 'select',
      title: 'Trạng thái',
      value: props.status,
      onChange: handleStatusChange,
      options: props.statusList.map((status) => ({
        label: status,
        value: status
      }))
    },
    {
      type: 'dateRange',
      title: 'Chọn thời gian khiếu nại',
      value: props.dateRange,
      onChange: handleDateChange
    }
  ];

  return (
    <Box className='flex gap-2 items-center w-full justify-between'>
      <Stack direction='row' spacing={1} width={'15%'}>
        <Typography fontWeight={'bold'}>Số lượng khiếu nại:</Typography>
        <Typography fontWeight={'bold'}>{props.numberOfReports}</Typography>
      </Stack>
      <AdvancedFilter filters={filters} />
    </Box>
  );
};

export default ReportFilter;
