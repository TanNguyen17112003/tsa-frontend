import { Box, CircularProgress, Stack } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { CustomTable } from '@components';
import getReportTableConfigs from './report-table-config';
import { ReportDetail, ReportStatus } from 'src/types/report';
import ReportFilter from './report-filter';
import usePagination from 'src/hooks/use-pagination';
import { useDrawer } from '@hooks';
import { useDialog } from '@hooks';
import useOrdersData from 'src/hooks/use-orders-data';
import ReportDetailEditDrawer from './report-detail-edit-drawer';
import ReportDetailDeleteDialog from './report-detail-delete-dialog';
import { formatUnixTimestamp } from 'src/utils/format-time-currency';
import { useReportsContext } from 'src/contexts/reports/reports-context';
import Pagination from 'src/components/ui/Pagination';

const ReportList: React.FC<{}> = ({}) => {
  const statusList = ['Tất cả', 'Đã giải quyết', 'Đang chờ xử lý'];
  const { deleteReport, getReportsApi, reportFilter, reportPagination, setReportFilter } =
    useReportsContext();

  const editDetailReportDrawer = useDrawer<ReportDetail>();
  const removeDetailReportDialog = useDialog<ReportDetail>();
  const orders = useOrdersData();

  const reports = useMemo(() => {
    return getReportsApi.data?.results || [];
  }, [getReportsApi.data]);

  const [status, setStatus] = React.useState('Tất cả');
  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: null,
    endDate: null
  });

  const reportTableConfig = React.useMemo(() => {
    return getReportTableConfigs({
      onClickEdit: (data: ReportDetail) => {
        editDetailReportDrawer.handleOpen(data);
      },
      onClickRemove: (data: ReportDetail) => {
        removeDetailReportDialog.handleOpen(data);
      },
      orders: orders.orders
    });
  }, [orders]);

  useEffect(() => {
    setReportFilter({
      ...reportFilter,
      page: reportPagination.page + 1,
      status: status !== 'Tất cả' ? (status as ReportStatus) : undefined,
      dateRange
    });
  }, [status, dateRange, reportPagination.page]);

  return (
    <Box className='flex flex-col min-h-screen bg-white px-6 py-4 text-black'>
      <ReportFilter
        statusList={statusList}
        numberOfReports={getReportsApi.data?.totalElements || 0}
        status={status}
        setStatus={setStatus}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />
      <Box sx={{ flex: 1 }}>
        {getReportsApi.loading ? (
          <Box display='flex' justifyContent='center' alignItems='center' height='100%'>
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
      </Box>
      <ReportDetailEditDrawer
        report={editDetailReportDrawer.data}
        open={editDetailReportDrawer.open}
        onClose={editDetailReportDrawer.handleClose}
      />
      <ReportDetailDeleteDialog
        report={removeDetailReportDialog.data!}
        open={removeDetailReportDialog.open}
        onClose={removeDetailReportDialog.handleClose}
        onConfirm={() => deleteReport(removeDetailReportDialog.data?.id as string)}
      />
    </Box>
  );
};

export default ReportList;
