import { Box } from '@mui/material';
import React from 'react';
import { CustomTable } from '@components';
import { initialReportList } from 'src/types/report';
import getReportTableConfigs from './report-table-config';
import { ReportDetail } from 'src/types/report';
import ReportFilter from './report-filter';
import usePagination from 'src/hooks/use-pagination';
import { useDrawer } from '@hooks';
import { useDialog } from '@hooks';
import ReportDetailEditDrawer from './report-detail-edit-drawer';
import ReportDetailDeleteDialog from './report-detail-delete-dialog';

function ReportList() {
  const reportStatusList = ['Tất cả', 'Đã giải quyết', 'Đang chờ xử lý', 'Đã từ chối'];
  const editDetailReportDrawer = useDrawer<ReportDetail>();
  const removeDetailReportDialog = useDialog<ReportDetail>();
  const [status, setStatus] = React.useState(reportStatusList[0]);
  const [dateRange, setDateRange] = React.useState({
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-31')
  });
  const reportTableConfig = React.useMemo(() => {
    return getReportTableConfigs({
      onClickEdit: (data: ReportDetail) => {
        editDetailReportDrawer.handleOpen(data);
      },
      onClickRemove: (data: ReportDetail) => {
        removeDetailReportDialog.handleOpen(data);
      }
    });
  }, []);
  const pagination = usePagination({
    count: initialReportList.length
  });
  const result = React.useMemo(() => {
    return initialReportList.filter((report) => {
      const isStatusMatch =
        status === 'Tất cả'
          ? true
          : status === 'Đã giải quyết'
            ? report.reportStatus === 'SOLVED'
            : status === 'Đang chờ xử lý'
              ? report.reportStatus === 'PENDING'
              : report.reportStatus === 'DECLINED';
      return isStatusMatch;
    });
  }, [status, dateRange, initialReportList]);
  return (
    <Box className='flex flex-col min-h-screen bg-white px-6 py-4 text-black'>
      <ReportFilter
        reportStatusList={reportStatusList}
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
      />
    </Box>
  );
}

export default ReportList;
