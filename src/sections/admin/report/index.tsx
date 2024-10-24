import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { CustomTable } from '@components';
import ReportFilter from './report-filter';
import getReportTableConfig from './report-table-config';
import { Box } from '@mui/material';
import { ReportDetail } from 'src/types/report';
import usePagination from 'src/hooks/use-pagination';
import { SelectChangeEvent } from '@mui/material';
import { useDrawer, useDialog } from '@hooks';
import { useReportsContext } from 'src/contexts/reports/reports-context';
import ReportDetailDenyDialog from './report-detail-deny-dialog';
import ReportDetailReplyDrawer from './report-detail-reply-drawer';
import useOrdersData from 'src/hooks/use-orders-data';
import { UsersApi } from 'src/api/users';
import useFunction from 'src/hooks/use-function';

function ReportList() {
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: null,
    endDate: null
  });
  const reportDetailReplyDrawer = useDrawer<ReportDetail>();
  const reportDetailDenyDialog = useDialog<ReportDetail>();
  const orders = useOrdersData();

  const { getReportsApi, deleteReport } = useReportsContext();
  const getListUsersApi = useFunction(UsersApi.getUsers);

  const reports = useMemo(() => {
    return getReportsApi.data || [];
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

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesDateRange =
        dateRange.startDate && dateRange.endDate
          ? new Date(Number(report.reportedAt) * 1000) >= dateRange.startDate &&
            new Date(Number(report.reportedAt) * 1000) <= dateRange.endDate
          : true;
      const matchesStatus = selectedStatus === '' ? true : report.status === selectedStatus;
      return matchesDateRange && matchesStatus;
    });
  }, [dateRange, selectedStatus, reports]);

  const pagination = usePagination({
    count: filteredReports.length
  });

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

  return (
    <Box className='px-6 text-black bg-white'>
      <ReportFilter
        selectedStatus={selectedStatus}
        dateRange={dateRange}
        onStatusChange={handleStatusChange}
        onDateChange={handleDateChange}
        onResetFilters={handleResetFilters}
        numberOfReport={filteredReports.length}
      />
      <CustomTable rows={filteredReports} configs={reportTableConfig} pagination={pagination} />
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
