import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { SelectChangeEvent, Stack, Typography, Pagination, CircularProgress } from '@mui/material';
import { UserTick } from 'iconsax-react';
import MobileContentHeader from 'src/components/mobile-content-header';
import { useUsersContext } from '@contexts';
import usePagination from 'src/hooks/use-pagination';
import { formatUnixTimestamp } from 'src/utils/format-time-currency';
import MobileStaffFilter from './student-filter/student-filter';
import MobileStaffCard from './student-card';
import LoadingProcess from 'src/components/LoadingProcess';

function MobileStudentList() {
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

  const students = useMemo(() => {
    return (getListUsersApi.data || []).filter((user) => user.role === 'STUDENT');
  }, [getListUsersApi.data]);

  const filteredstudents = useMemo(() => {
    setLoading(true);
    const result = students.filter((student) => {
      const filterStatus = selectedStatus === 'all' ? true : selectedStatus === student.status;
      const studentDate = formatUnixTimestamp(student.createdAt);
      const filterDate =
        !dateRange.startDate || !dateRange.endDate
          ? true
          : dateRange.startDate && dateRange.endDate
            ? dateRange.startDate <= studentDate && studentDate <= dateRange.endDate
            : true;
      return filterStatus && filterDate;
    });
    setLoading(false);
    return result;
  }, [students, selectedStatus, dateRange]);

  const pagination = usePagination({
    count: filteredstudents.length,
    initialRowsPerPage: 5
  });

  useEffect(() => {
    pagination.onPageChange(null, 1);
  }, [filteredstudents.length]);

  const paginatedstudents = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.rowsPerPage;
    const endIndex = startIndex + pagination.rowsPerPage;
    return filteredstudents.slice(startIndex, endIndex);
  }, [filteredstudents, pagination.page, pagination.rowsPerPage]);

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
          title={'Danh sách sinh viên hệ thống'}
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
          numberOfStaffs={filteredstudents.length}
        />
      </Stack>

      <Stack mt={2} sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <Typography fontWeight={'bold'} color='primary'>
          {filteredstudents.length} sinh viên
        </Typography>
        {loading ? (
          <LoadingProcess />
        ) : (
          <Stack spacing={1.5} mt={1}>
            {paginatedstudents.length === 0 && (
              <Stack className='items-center justify-center h-[300px]'>
                <Typography variant='h5' color='error'>
                  Không có sinh viên nào
                </Typography>
              </Stack>
            )}
            {paginatedstudents.map((student, index) => (
              <MobileStaffCard key={index} student={student} number={index + 1} />
            ))}
          </Stack>
        )}
        <Pagination
          count={Math.ceil(filteredstudents.length / pagination.rowsPerPage)}
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

export default MobileStudentList;
