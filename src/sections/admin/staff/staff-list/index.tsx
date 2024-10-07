import React, { useState, useMemo, useCallback } from 'react';
import { CustomTable } from '@components';
import { Box } from '@mui/material';
import { ReportDetail } from 'src/types/report';
import usePagination from 'src/hooks/use-pagination';
import { SelectChangeEvent } from '@mui/material';
import { useDrawer, useDialog } from '@hooks';
import { initialStaffList, UserDetail } from 'src/types/user';
import getStaffTableConfig from './staff-table-config';
import StudentFilter from './staff-filter';
import { useRouter } from 'next/router';

function StaffList() {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: null,
    endDate: null
  });

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setSelectedStatus(event.target.value as string);
  };

  const handleDateChange = (range: { startDate: Date | null; endDate: Date | null }) => {
    setDateRange(range);
  };

  const handleResetFilters = () => {
    setSelectedStatus('');
    setDateRange({ startDate: null, endDate: null });
  };

  const handleGoStaff = useCallback((staff: UserDetail) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, staffId: staff.id }
    });
  }, []);

  const filteredStaffs = useMemo(() => {
    return initialStaffList.filter((staff) => {
      const matchesDateRange =
        dateRange.startDate && dateRange.endDate
          ? new Date(Number(staff.createdAt) * 1000) >= dateRange.startDate &&
            new Date(Number(staff.createdAt) * 1000) <= dateRange.endDate
          : true;
      const matchesStatus = selectedStatus === '' ? true : staff.status === selectedStatus;
      return matchesDateRange && matchesStatus;
    });
  }, [dateRange, selectedStatus, initialStaffList]);

  const pagination = usePagination({
    count: filteredStaffs.length
  });

  const staffTableConfig = useMemo(() => {
    return getStaffTableConfig({
      onClickDeny: (data: UserDetail) => {
        console.log(data);
      },
      onClickReply: (data: UserDetail) => {
        console.log(data);
      }
    });
  }, []);

  return (
    <Box className='px-6 text-black bg-white'>
      <StudentFilter
        selectedStatus={selectedStatus}
        dateRange={dateRange}
        onDateChange={handleDateChange}
        onStatusChange={handleStatusChange}
        onResetFilters={handleResetFilters}
        numberOfStaff={filteredStaffs.length}
      />
      <CustomTable
        rows={filteredStaffs}
        configs={staffTableConfig}
        pagination={pagination}
        onClickRow={(data: UserDetail) => handleGoStaff(data)}
      />
    </Box>
  );
}

export default StaffList;
