import React, { useState, useMemo, useCallback } from 'react';
import { CustomTable } from '@components';
import { Box } from '@mui/material';
import usePagination from 'src/hooks/use-pagination';
import { SelectChangeEvent } from '@mui/material';
import { useDrawer, useDialog } from '@hooks';
import { UserDetail } from 'src/types/user';
import getStudentTableConfig from './student-table-config';
import StudentFilter from './student-filter';
import { useRouter } from 'next/router';
import { useUsersContext } from '@contexts';
import DeleteUserDialog from '../../delete-user-dialog';

function StudentList() {
  const router = useRouter();
  const { getListUsersApi, deleteUser } = useUsersContext();
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedDormitory, setSelectedDormitory] = useState<string>('');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('');
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: null,
    endDate: null
  });

  const studentList = useMemo(() => {
    return (getListUsersApi.data || []).filter((user) => user.role === 'STUDENT');
  }, [getListUsersApi.data]);

  const deleteStudentDialog = useDialog<UserDetail>();

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setSelectedStatus(event.target.value as string);
  };

  const handleDormitoryChange = (event: SelectChangeEvent<string>) => {
    setSelectedDormitory(event.target.value as string);
    setSelectedBuilding('');
    setSelectedRoom('');
  };

  const handleBuildingChange = (event: SelectChangeEvent<string>) => {
    setSelectedBuilding(event.target.value as string);
    setSelectedRoom('');
  };

  const handleRoomChange = (event: SelectChangeEvent<string>) => {
    setSelectedRoom(event.target.value as string);
  };

  const handleDateChange = (range: { startDate: Date | null; endDate: Date | null }) => {
    setDateRange(range);
  };

  const handleResetFilters = () => {
    setSelectedDormitory('');
    setSelectedBuilding('');
    setSelectedRoom('');
    setSelectedStatus('');
    setDateRange({ startDate: null, endDate: null });
  };

  const handleGoStudent = useCallback((data: UserDetail) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, studentId: data.id }
    });
  }, []);

  const filteredStudents = useMemo(() => {
    return studentList.filter((student) => {
      const matchesDormitory = selectedDormitory ? student.dormitory === selectedDormitory : true;
      const matchesBuilding = selectedBuilding ? student.building === selectedBuilding : true;
      const matchesRoom = selectedRoom ? student.room === selectedRoom : true;
      const matchesDateRange =
        dateRange.startDate && dateRange.endDate
          ? new Date(Number(student.createdAt) * 1000) >= dateRange.startDate &&
            new Date(Number(student.createdAt) * 1000) <= dateRange.endDate
          : true;
      const matchesStatus = selectedStatus === '' ? true : student.status === selectedStatus;
      return (
        matchesDormitory && matchesBuilding && matchesRoom && matchesDateRange && matchesStatus
      );
    });
  }, [selectedDormitory, selectedBuilding, selectedRoom, dateRange, selectedStatus, studentList]);

  const pagination = usePagination({
    count: filteredStudents.length
  });

  const studentTableConfig = useMemo(() => {
    return getStudentTableConfig({
      onClickDelete: (data: UserDetail) => {
        deleteStudentDialog.handleOpen(data);
      },
      onClickUpgrade: (data: UserDetail) => {
        console.log(data);
      }
    });
  }, []);

  return (
    <Box className='px-6 text-black bg-white'>
      <StudentFilter
        selectedDormitory={selectedDormitory}
        selectedBuilding={selectedBuilding}
        selectedRoom={selectedRoom}
        selectedStatus={selectedStatus}
        dateRange={dateRange}
        onDormitoryChange={handleDormitoryChange}
        onBuildingChange={handleBuildingChange}
        onRoomChange={handleRoomChange}
        onDateChange={handleDateChange}
        onStatusChange={handleStatusChange}
        onResetFilters={handleResetFilters}
        numberOfStudent={filteredStudents.length}
      />
      <CustomTable
        rows={filteredStudents}
        configs={studentTableConfig}
        pagination={pagination}
        onClickRow={(data: UserDetail) => handleGoStudent(data)}
      />
      <DeleteUserDialog
        open={deleteStudentDialog.open}
        user={deleteStudentDialog.data as UserDetail}
        onClose={deleteStudentDialog.handleClose}
        onConfirm={() => deleteUser(deleteStudentDialog.data?.id as string)}
      />
    </Box>
  );
}

export default StudentList;
