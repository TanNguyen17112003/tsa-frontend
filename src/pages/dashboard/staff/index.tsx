import React, { useMemo } from 'react';
import type { Page as PageType } from 'src/types/page';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import ContentHeader from 'src/components/content-header';
import { Box } from '@mui/material';
import StaffList from 'src/sections/admin/staff/staff-list';
import StaffDetail from './[staffId]';
import { useRouter } from 'next/router';

const Page: PageType = () => {
  const router = useRouter();
  return router.query.staffId ? (
    <StaffDetail />
  ) : (
    <Box className='text-black bg-white min-h-screen'>
      <ContentHeader title='Quản lý nhân viên' />
      <StaffList />
    </Box>
  );
};
Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
