import React, { useMemo } from 'react';
import type { Page as PageType } from 'src/types/page';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import ContentHeader from 'src/components/content-header';
import { Box } from '@mui/material';
import ReportList from 'src/sections/student/report/report-list';
import ReportsProvider from 'src/contexts/reports/reports-context';
import { useReportsContext } from 'src/contexts/reports/reports-context';
import { useResponsive } from 'src/utils/use-responsive';
import MobileReportList from 'src/sections/mobile/student/report/report-list';

const Page: PageType = () => {
  const { getReportsApi } = useReportsContext();
  const { isMobile } = useResponsive();
  const reports = useMemo(() => {
    return getReportsApi.data || [];
  }, [getReportsApi.data]);
  return (
    <Box>
      {isMobile ? (
        <MobileReportList />
      ) : (
        <Box className='min-h-screen overflow-auto'>
          {' '}
          <ContentHeader title='Lịch sử khiếu nại' description='Danh sách khiếu nại của bạn' />
          <ReportList reports={reports} loading={getReportsApi.loading} />
        </Box>
      )}
    </Box>
  );
};
Page.getLayout = (page) => (
  <DashboardLayout>
    <ReportsProvider>{page}</ReportsProvider>
  </DashboardLayout>
);

export default Page;
