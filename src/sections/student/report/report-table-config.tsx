import { IconButton, Typography, Stack, Button } from '@mui/material';
import { CustomTableConfig } from 'src/components/custom-table';
import { RouterLink } from 'src/components/router-link';
import { paths } from 'src/paths';
import { Edit, Trash } from 'iconsax-react';
import { ReportDetail } from 'src/types/report';

const getReportTableConfigs = ({
  onClickEdit,
  onClickRemove
}: {
  onClickEdit: (data: ReportDetail) => void;
  onClickRemove: (data: ReportDetail) => void;
}): CustomTableConfig<ReportDetail['id'], ReportDetail>[] => [
  {
    key: 'orderCode',
    headerLabel: 'Mã đơn hàng',
    type: 'string',
    renderCell: (data) => <Typography>#{data.orderCode}</Typography>
  },
  {
    key: 'reportDate',
    headerLabel: 'Ngày khiếu nại',
    type: 'string'
  },
  {
    key: 'reportContent',
    headerLabel: 'Nội dung khiếu nại',
    type: 'string'
  },
  {
    key: 'proof',
    headerLabel: 'Minh chứng',
    type: 'string'
  },
  {
    key: 'reply',
    headerLabel: 'Phản hồi',
    type: 'string'
  },
  {
    key: 'status',
    headerLabel: 'Trạng thái',
    type: 'string',
    renderCell: (data) => (
      <Button
        variant='outlined'
        color={
          data.reportStatus === 'SOLVED'
            ? 'success'
            : data.reportStatus === 'PENDING'
              ? 'warning'
              : 'error'
        }
      >
        <Typography>
          {data.reportStatus === 'SOLVED'
            ? 'Đã giải quyết'
            : data.reportStatus === 'PENDING'
              ? 'Đang chờ xử lý'
              : 'Đã từ chối'}
        </Typography>
      </Button>
    )
  },
  {
    key: 'action',
    headerLabel: 'Hành động',
    type: 'string',
    renderCell: (data) => (
      <Stack direction={'row'} spacing={1}>
        <Edit color='blue' size={24} className='cursor-pointer' onClick={() => onClickEdit(data)} />
        <Trash
          color='red'
          size={24}
          className='cursor-pointer'
          onClick={() => onClickRemove(data)}
        />
      </Stack>
    )
  }
];

export default getReportTableConfigs;
