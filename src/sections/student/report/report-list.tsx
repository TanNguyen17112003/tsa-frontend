import { Box } from '@mui/material';
import React, { useState } from 'react';
import { CustomTable } from '@components';
import getReportTableConfigs from './report-table-config';
import { ReportDetail } from 'src/types/report';
import ReportFilter from './report-filter';
import usePagination from 'src/hooks/use-pagination';
import { useDrawer } from '@hooks';
import { useDialog } from '@hooks';
import useOrdersData from 'src/hooks/use-orders-data';
import ReportDetailEditDrawer from './report-detail-edit-drawer';
import ReportDetailDeleteDialog from './report-detail-delete-dialog';
import { formatUnixTimestamp } from 'src/utils/format-time-currency';
import { useReportsContext } from 'src/contexts/reports/reports-context';

interface ReportListProps {
  reports: ReportDetail[];
}

const ReportList: React.FC<ReportListProps> = ({ reports }) => {
  const statusList = ['Tất cả', 'Đã giải quyết', 'Đang chờ xử lý'];
  const { deleteReport } = useReportsContext();

  const editDetailReportDrawer = useDrawer<ReportDetail>();
  const removeDetailReportDialog = useDialog<ReportDetail>();
  const orders = useOrdersData();

  const [status, setStatus] = React.useState(statusList[0]);
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

  const pagination = usePagination({
    count: reports.length
  });

  const result = React.useMemo(() => {
    return reports.filter((report) => {
      const filterStatus =
        status === 'Tất cả'
          ? true
          : status === 'Đã giải quyết'
            ? report.status === 'REPLIED'
            : report.status === 'PENDING';
      const reportDate = formatUnixTimestamp(report.reportedAt!);
      const filterDate =
        !dateRange.startDate || !dateRange.endDate
          ? true
          : dateRange.startDate !== null &&
            dateRange.endDate !== null &&
            dateRange.startDate <= reportDate &&
            reportDate <= dateRange.endDate;
      return filterStatus && filterDate;
    });
  }, [status, dateRange, reports]);

  return (
    <Box className='flex flex-col min-h-screen bg-white px-6 py-4 text-black'>
      <ReportFilter
        statusList={statusList}
        numberOfReports={result.length}
        status={status}
        setStatus={setStatus}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />
      <Box sx={{ flex: 1 }}>
        <CustomTable
          rows={result}
          configs={reportTableConfig}
          pagination={pagination}
          className='my-5 -mx-6'
        />
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
