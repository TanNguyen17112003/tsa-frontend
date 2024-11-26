import React, { useMemo } from 'react';
import type { Page as PageType } from 'src/types/page';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import ContentHeader from 'src/components/content-header';
import { Box } from '@mui/material';
import ReportsProvider from 'src/contexts/reports/reports-context';
import ReportList from 'src/sections/admin/report';
import { useResponsive } from 'src/utils/use-responsive';
import MobileReportList from 'src/sections/mobile/admin/report/report-list';

const Page: PageType = () => {
  const { isMobile } = useResponsive();
  return (
    <>
      {isMobile ? (
        <MobileReportList />
      ) : (
        <Box className='text-black bg-white min-h-screen'>
          <ContentHeader title='Quản lý khiếu nại' />
          <ReportList />
        </Box>
      )}
    </>
  );
};
Page.getLayout = (page) => (
  <DashboardLayout>
    <ReportsProvider>{page}</ReportsProvider>
  </DashboardLayout>
);

export default Page;
