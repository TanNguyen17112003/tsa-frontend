import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { Stack, Typography, Box as MuiBox, CircularProgress } from '@mui/material';
import Pagination from 'src/components/ui/Pagination';
import { DocumentText } from 'iconsax-react';
import MobileContentHeader from 'src/components/mobile-content-header';
import ReportCard from './report-card';
import { useReportsContext } from 'src/contexts/reports/reports-context';
import { Filter } from 'src/types/filter';
import MobileAdvancedFilter from 'src/components/mobile-advanced-filter/mobile-advanced-filter';
import { ReportStatus } from 'src/types/report';

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
  const { getReportsApi, setReportFilter, reportFilter, reportPagination } = useReportsContext();

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
      title: 'Nhập thời gian tạo khiếu nại',
      value: dateRange,
      onChange: handleDateChange
    }
  ];

  const reports = useMemo(() => {
    return getReportsApi.data?.results || [];
  }, [getReportsApi.data]);

  const numberOfReports = useMemo(() => {
    return getReportsApi.data?.totalElements || 0;
  }, [getReportsApi.data]);

  useEffect(() => {
    setReportFilter({
      ...reportFilter,
      status: selectedStatus !== 'Tất cả' ? (selectedStatus as ReportStatus) : undefined,
      dateRange,
      page: reportPagination.page + 1
    });
  }, [selectedStatus, dateRange, reportPagination.page]);

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
          {numberOfReports} khiếu nại
        </Typography>
        {getReportsApi.loading ? (
          <Stack className='items-center justify-center h-[300px]'>
            <CircularProgress />
          </Stack>
        ) : (
          <Stack spacing={1.5} mt={1}>
            {reports.length === 0 && (
              <Stack className='items-center justify-center h-[300px]'>
                <Typography variant='h5' color='error'>
                  Không có khiếu nại nào
                </Typography>
              </Stack>
            )}
            {reports.map((report, index) => (
              <ReportCard key={index} report={report} number={index + 1} />
            ))}
            <Pagination
              page={reportPagination.page}
              count={numberOfReports}
              onChange={reportPagination.onPageChange}
              rowsPerPage={10}
            />
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}

export default MobileReportList;
