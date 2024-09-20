import React from 'react';
import type { Page as PageType } from 'src/types/page';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import ContentHeader from 'src/components/content-header';
import { Box } from '@mui/material';
import ReportList from 'src/sections/student/report/report-list';
import ReportsProvider from 'src/contexts/reports/reports-context';

const Page: PageType = () => {
  return (
    <Box>
      <ContentHeader
        title='Lịch sử khiếu nại'
        description='Danh sách khiếu nại của bạn đối với hệ thống'
      />
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
