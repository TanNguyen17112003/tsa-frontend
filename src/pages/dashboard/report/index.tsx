import React, { useMemo } from 'react';
import type { Page as PageType } from 'src/types/page';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import ContentHeader from 'src/components/content-header';
import { Box } from '@mui/material';
import ReportsProvider from 'src/contexts/reports/reports-context';
import ReportList from 'src/sections/admin/report';

const Page: PageType = () => {
  return (
    <Box className='text-black bg-white min-h-screen'>
      <ContentHeader title='Quản lý khiếu nại' />
      <ReportList />
    </Box>
  );
};
Page.getLayout = (page) => (
  <DashboardLayout>
    <ReportsProvider>{page}</ReportsProvider>
  </DashboardLayout>
);

export default Page;
