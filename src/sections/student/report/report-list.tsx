import { Box } from '@mui/material';
import React from 'react';
import { CustomTable } from '@components';
import { initialReportList } from 'src/types/report';
import getReportTableConfigs from './report-table-config';
import { ReportDetail } from 'src/types/report';
import ReportFilter from './report-filter';
import usePagination from 'src/hooks/use-pagination';

function ReportList() {
  const reportTableConfig = React.useMemo(() => {
    return getReportTableConfigs({
      onClick: (data: ReportDetail) => {
        console.log(data);
      }
    });
  }, []);
  const pagination = usePagination({
    count: initialReportList.length
  });
  return (
    <Box className='flex flex-col min-h-screen bg-white px-6 py-4 text-black'>
      <ReportFilter />
      <Box sx={{ flex: 1 }}>
        <CustomTable
          rows={initialReportList}
          configs={reportTableConfig}
          pagination={pagination}
          className='my-5 -mx-6'
        />
      </Box>
    </Box>
  );
}

export default ReportList;
