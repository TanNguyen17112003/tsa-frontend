import React from 'react';
import type { Page as PageType } from 'src/types/page';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import ContentHeader from 'src/components/content-header';
import { Box } from '@mui/material';
import StudentList from 'src/sections/admin/student/student-list';
import StudentDetail from './[studentId]';
import { useRouter } from 'next/router';
import UsersProvider from 'src/contexts/users/users-context';
import MobileStudentList from 'src/sections/mobile/admin/student/student-list';
import { useResponsive } from 'src/utils/use-responsive';

const Page: PageType = () => {
  const router = useRouter();
  const { isMobile } = useResponsive();
  return router.query.studentId ? (
    <StudentDetail />
  ) : isMobile ? (
    <MobileStudentList />
  ) : (
    <Box className='text-black bg-white min-h-screen'>
      <ContentHeader title='Quản lý sinh viên' />
      <StudentList />
    </Box>
  );
};
Page.getLayout = (page) => (
  <DashboardLayout>
    <UsersProvider>{page}</UsersProvider>
  </DashboardLayout>
);

export default Page;
