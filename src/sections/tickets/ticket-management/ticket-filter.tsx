import React, { useState } from 'react';
import { Box, Typography, Stack, TextField, InputAdornment } from '@mui/material';
import { SearchIcon } from 'lucide-react';
import AdvancedFilter from 'src/components/advanced-filter/advanced-filter';
import { Filter } from 'src/types/filter';
import { ticketStatusMap } from 'src/types/ticket';

interface TicketFilterProps {
  statusList: string[];
  numberOfTickets: number;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  dateRange: {
    startDate: Date | null;
    endDate: Date | null;
  };
  setDateRange: (range: any) => void;
  onSearch: (checkCode: string) => void;
}

const TicketFilter: React.FC<TicketFilterProps> = (props) => {
  const [searchInput, setSearchInput] = useState('');

  const handleDateChange = React.useCallback((range: any) => {
    props.setDateRange(range);
  }, []);

  const handleStatusChange = React.useCallback((status: string) => {
    props.setSelectedStatus(
      status === 'Tất cả' ? 'Tất cả' : ticketStatusMap[status as keyof typeof ticketStatusMap]
    );
  }, []);

  const handleSearch = () => {
    props.onSearch(searchInput);
  };

  const filters: Filter[] = [
    {
      type: 'select',
      title: 'Trạng thái câu hỏi/yêu cầu',
      value: props.selectedStatus,
      onChange: handleStatusChange,
      options: props.statusList.map((status) => ({
        label: status,
        value: status
      }))
    },
    {
      type: 'dateRange',
      title: 'Nhập thời gian tạo câu hỏi/yêu cầu',
      value: props.dateRange,
      onChange: handleDateChange
    }
  ];

  return (
    <Box className='flex justify-between'>
      <Box className='flex gap-5 items-center w-full'>
        <Stack direction='row' spacing={0.5}>
          <Typography fontWeight={'bold'}>Số lượng câu hỏi/yêu cầu:</Typography>
          <Typography fontWeight={'bold'}>{props.numberOfTickets}</Typography>
        </Stack>
        <TextField
          variant='outlined'
          placeholder='Tìm kiếm theo chủ đề'
          className='w-[35%]'
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end' className='cursor-pointer' onClick={handleSearch}>
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
      </Box>
      <AdvancedFilter filters={filters} />
    </Box>
  );
};

export default TicketFilter;
