import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { SelectChangeEvent, Stack, Typography, Pagination, CircularProgress } from '@mui/material';
import { UserTick } from 'iconsax-react';
import MobileContentHeader from 'src/components/mobile-content-header';
import { useUsersContext } from '@contexts';
import usePagination from 'src/hooks/use-pagination';
import { formatUnixTimestamp } from 'src/utils/format-time-currency';
import MobileStaffFilter from './staff-filter/staff-filter';
import MobileStaffCard from './staff-card';
import LoadingProcess from 'src/components/LoadingProcess';

function MobileStaffList() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null
  });
  const [loading, setLoading] = useState(true);

  const { getListUsersApi } = useUsersContext();

  const handleDateChange = useCallback((range: { startDate?: Date; endDate?: Date }) => {
    setDateRange({
      startDate: range.startDate || null,
      endDate: range.endDate || null
    });
  }, []);

  const handleStatusChange = useCallback((status: string) => {
    setSelectedStatus(status);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSelectedStatus('all');
    setDateRange({ startDate: null, endDate: null });
  }, []);

  const staffs = useMemo(() => {
    return (getListUsersApi.data || []).filter((user) => user.role === 'STAFF');
  }, [getListUsersApi.data]);

  const filteredstaffs = useMemo(() => {
    setLoading(true);
    const result = staffs.filter((staff) => {
      const filterStatus = selectedStatus === 'all' ? true : selectedStatus === staff.status;
      const staffDate = formatUnixTimestamp(staff.createdAt);
      const filterDate =
        !dateRange.startDate || !dateRange.endDate
          ? true
          : dateRange.startDate && dateRange.endDate
            ? dateRange.startDate <= staffDate && staffDate <= dateRange.endDate
            : true;
      return filterStatus && filterDate;
    });
    setLoading(false);
    return result;
  }, [staffs, selectedStatus, dateRange]);

  const pagination = usePagination({
    count: filteredstaffs.length,
    initialRowsPerPage: 5
  });

  useEffect(() => {
    pagination.onPageChange(null, 1);
  }, [filteredstaffs.length]);

  const paginatedstaffs = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.rowsPerPage;
    const endIndex = startIndex + pagination.rowsPerPage;
    return filteredstaffs.slice(startIndex, endIndex);
  }, [filteredstaffs, pagination.page, pagination.rowsPerPage]);

  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, page: number) => {
      pagination.onPageChange(null, page);
    },
    [pagination]
  );

  return (
    <Stack className='min-h-screen bg-white py-4 px-3'>
      <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
        <MobileContentHeader
          title={'Danh sách nhân viên hệ thống'}
          image={<UserTick size={24} color='green' />}
        />
        <MobileStaffFilter
          selectedStatus={selectedStatus}
          dateRange={dateRange}
          onDateChange={handleDateChange}
          onStatusChange={(event: SelectChangeEvent<string>) =>
            handleStatusChange(event.target.value)
          }
          onResetFilters={handleResetFilters}
          numberOfStaffs={filteredstaffs.length}
        />
      </Stack>

      <Stack mt={2} sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <Typography fontWeight={'bold'} color='primary'>
          {filteredstaffs.length} nhân viên
        </Typography>
        {loading ? (
          <LoadingProcess />
        ) : (
          <Stack spacing={1.5} mt={1}>
            {paginatedstaffs.length === 0 && (
              <Stack className='items-center justify-center h-[300px]'>
                <Typography variant='h5' color='error'>
                  Không có nhân viên nào
                </Typography>
              </Stack>
            )}
            {paginatedstaffs.map((staff, index) => (
              <MobileStaffCard key={index} staff={staff} number={index + 1} />
            ))}
          </Stack>
        )}
        <Pagination
          count={Math.ceil(filteredstaffs.length / pagination.rowsPerPage)}
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

export default MobileStaffList;
