import { IconButton, Typography, Stack, Button, Chip } from '@mui/material';
import { CustomTableConfig } from 'src/components/custom-table';
import { paths } from 'src/paths';
import { Edit, Trash } from 'iconsax-react';
import { ReportDetail } from 'src/types/report';
import { formatUnixTimestamp } from 'src/utils/format-unix-time';

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
    renderCell: (data) => <Typography>#{data.orderId!}</Typography>
  },
  {
    key: 'reportedAt',
    headerLabel: 'Ngày khiếu nại',
    type: 'string',
    renderCell: (data) => <Typography>{formatUnixTimestamp(data.reportedAt!)}</Typography>
  },
  {
    key: 'content',
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
      <Chip
        variant='filled'
        label={data.status === 'REPLIED' ? 'Đã giải quyết' : 'Đang chờ xử lý'}
        color={data.status === 'REPLIED' ? 'success' : 'warning'}
      />
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
