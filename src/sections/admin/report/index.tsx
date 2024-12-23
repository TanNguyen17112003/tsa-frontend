import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { CustomTable } from '@components';
import ReportFilter from './report-filter';
import getReportTableConfig from './report-table-config';
import { Box, Stack } from '@mui/material';
import { ReportDetail, ReportStatus } from 'src/types/report';
import { SelectChangeEvent, CircularProgress } from '@mui/material';
import { useDrawer, useDialog } from '@hooks';
import { useReportsContext } from 'src/contexts/reports/reports-context';
import ReportDetailDenyDialog from './report-detail-deny-dialog';
import ReportDetailReplyDrawer from './report-detail-reply-drawer';
import useOrdersData from 'src/hooks/use-orders-data';
import { UsersApi } from 'src/api/users';
import useFunction from 'src/hooks/use-function';
import Pagination from 'src/components/ui/Pagination';

function ReportList() {
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: null,
    endDate: null
  });
  const reportDetailReplyDrawer = useDrawer<ReportDetail>();
  const reportDetailDenyDialog = useDialog<ReportDetail>();
  const orders = useOrdersData();

  const { getReportsApi, deleteReport, reportFilter, setReportFilter, reportPagination } =
    useReportsContext();
  const getListUsersApi = useFunction(UsersApi.getUsers);

  const reports = useMemo(() => {
    return getReportsApi.data?.results || [];
  }, [getReportsApi.data]);

  const users = useMemo(() => {
    return getListUsersApi.data || [];
  }, [getListUsersApi.data]);

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setSelectedStatus(event.target.value as string);
  };

  const handleDateChange = (range: { startDate: Date | null; endDate: Date | null }) => {
    setDateRange(range);
  };

  const handleResetFilters = useCallback(() => {
    setSelectedStatus('');
    setDateRange({ startDate: null, endDate: null });
  }, []);

  const reportTableConfig = useMemo(() => {
    return getReportTableConfig({
      onClickDeny: (data: any) => {
        reportDetailDenyDialog.handleOpen(data);
      },
      onClickReply: (data: any) => {
        reportDetailReplyDrawer.handleOpen(data);
      },
      orders: orders.orders,
      users: users
    });
  }, [orders, users]);

  useEffect(() => {
    getListUsersApi.call({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setReportFilter({
      ...reportFilter,
      page: reportPagination.page + 1,
      status: selectedStatus !== 'Tất cả' ? (selectedStatus as ReportStatus) : undefined,
      dateRange
    });
  }, [selectedStatus, dateRange, reportPagination.page]);

  return (
    <Box className='px-6 text-black bg-white'>
      <ReportFilter
        selectedStatus={selectedStatus}
        dateRange={dateRange}
        onStatusChange={handleStatusChange}
        onDateChange={handleDateChange}
        onResetFilters={handleResetFilters}
        numberOfReport={getReportsApi.data?.totalElements || 0}
      />
      {getReportsApi.loading ? (
        <Box display='flex' justifyContent='center'>
          <CircularProgress />
        </Box>
      ) : (
        <Stack spacing={2} mt={3}>
          <CustomTable rows={reports} configs={reportTableConfig} className='my-5 -mx-6' />
          <Pagination
            page={reportPagination.page}
            count={getReportsApi.data?.totalElements || 0}
            rowsPerPage={reportPagination.rowsPerPage}
            onChange={reportPagination.onPageChange}
          />
        </Stack>
      )}

      <ReportDetailDenyDialog
        open={reportDetailDenyDialog.open}
        onClose={reportDetailDenyDialog.handleClose}
        report={reportDetailDenyDialog.data as ReportDetail}
        onConfirm={() => deleteReport(reportDetailDenyDialog.data?.id as string)}
      />
      <ReportDetailReplyDrawer
        open={reportDetailReplyDrawer.open}
        onClose={reportDetailReplyDrawer.handleClose}
        report={reportDetailReplyDrawer.data as ReportDetail}
      />
    </Box>
  );
}

export default ReportList;
