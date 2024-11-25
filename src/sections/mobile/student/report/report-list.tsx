import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { SelectChangeEvent, Stack, Typography, Pagination, Box as MuiBox } from '@mui/material';
import { Box, DocumentText } from 'iconsax-react';
import MobileContentHeader from 'src/components/mobile-content-header';
import { useRouter } from 'next/router';
import ReportCard from './report-card';
import { useReportsContext } from 'src/contexts/reports/reports-context';
import usePagination from 'src/hooks/use-pagination';
import { Filter } from 'src/types/filter';
import { formatUnixTimestamp } from 'src/utils/format-time-currency';
import MobileAdvancedFilter from 'src/components/mobile-advanced-filter/mobile-advanced-filter';

function MobileReportList() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null
  });
  const statusList = [
    {
      label: 'Tất cả',
      value: 'all'
    },
    {
      label: 'Đã xử lý',
      value: 'REPLIED'
    },
    {
      label: 'Đang chờ xử lý',
      value: 'PENDING'
    }
  ];
  const { getReportsApi } = useReportsContext();

  const handleDateChange = useCallback(
    (range: { startDate: Date | null; endDate: Date | null }) => {
      setDateRange(range);
    },
    []
  );

  const handleStatusChange = useCallback((status: string) => {
    setSelectedStatus(status);
  }, []);

  const filters: Filter[] = [
    {
      type: 'select',
      title: 'Trạng thái',
      value: selectedStatus,
      onChange: handleStatusChange,
      options: statusList.map((status) => ({
        label: status.label,
        value: status.value
      }))
    },
    {
      type: 'dateRange',
      title: 'Nhập thời gian giao khiếu nại',
      value: dateRange,
      onChange: handleDateChange
    }
  ];

  const reports = useMemo(() => {
    return getReportsApi.data || [];
  }, [getReportsApi.data]);

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const filterStatus = selectedStatus === 'all' || report.status === selectedStatus;
      const reportDate = formatUnixTimestamp(report.reportedAt as string);
      const filterDate =
        !dateRange.startDate || !dateRange.endDate
          ? true
          : dateRange.startDate && dateRange.endDate
            ? dateRange.startDate <= reportDate && reportDate <= dateRange.endDate
            : true;
      return filterStatus && filterDate;
    });
  }, [reports, selectedStatus, dateRange]);

  const pagination = usePagination({
    count: filteredReports.length,
    initialRowsPerPage: 5
  });

  useEffect(() => {
    pagination.onPageChange(null, 1);
  }, [filteredReports.length]);

  const paginatedReports = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.rowsPerPage;
    const endIndex = startIndex + pagination.rowsPerPage;
    return filteredReports.slice(startIndex, endIndex);
  }, [filteredReports, pagination.page, pagination.rowsPerPage]);

  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, page: number) => {
      pagination.onPageChange(null, page);
    },
    [pagination]
  );

  return (
    <Stack className='min-h-screen py-4 px-3 bg-white'>
      <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
        <MobileContentHeader
          title={'Lịch sử khiếu nại'}
          image={<DocumentText size={24} color='green' />}
        />
        <MuiBox>
          <MobileAdvancedFilter filters={filters} />
        </MuiBox>
      </Stack>
      <Stack mt={1.5} sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <Typography fontWeight={'bold'} color='black' className='mb-2'>
          {filteredReports.length} khiếu nại
        </Typography>
        <Stack spacing={1.5} mt={1}>
          {paginatedReports.length === 0 && (
            <Stack className='items-center justify-center h-[300px]'>
              <Typography variant='h5' color='error'>
                Không có khiếu nại nào
              </Typography>
            </Stack>
          )}
          {paginatedReports.map((report, index) => (
            <ReportCard key={index} report={report} number={index + 1} />
          ))}
        </Stack>
        <Pagination
          count={Math.ceil(filteredReports.length / pagination.rowsPerPage)}
          page={pagination.page}
          onChange={handlePageChange}
          color='primary'
          shape='rounded'
          size='small'
          className='self-center mt-2'
        />
      </Stack>
    </Stack>
  );
}

export default MobileReportList;
