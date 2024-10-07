import React, { useMemo } from 'react';
import type { Page as PageType } from 'src/types/page';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import ContentHeader from 'src/components/content-header';
import { Box } from '@mui/material';
import StudentList from 'src/sections/admin/student/student-list';
import StudentDetail from './[studentId]';
import { useRouter } from 'next/router';

const Page: PageType = () => {
  const router = useRouter();
  return router.query.studentId ? (
    <StudentDetail />
  ) : (
    <Box className='text-black bg-white min-h-screen'>
      <ContentHeader title='Quản lý người dùng' />
      <StudentList />
    </Box>
  );
};
Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
