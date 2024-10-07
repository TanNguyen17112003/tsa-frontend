import { Typography, Stack, Chip, Tooltip } from '@mui/material';
import { CustomTableConfig } from 'src/components/custom-table';
import { ArrowForward, CloseCircle } from 'iconsax-react';
import { formatDate, formatUnixTimestamp } from 'src/utils/format-time-currency';
import { ReportDetail } from 'src/types/report';

const getReportTableConfig = ({
  onClickDeny,
  onClickReply
}: {
  onClickDeny: (data: ReportDetail) => void;
  onClickReply: (data: ReportDetail) => void;
}): CustomTableConfig<ReportDetail['id'], ReportDetail>[] => [
  {
    key: 'checkCode',
    headerLabel: 'Mã đơn hàng',
    type: 'string',
    renderCell: (data) => <Typography>#{data.orderCode}</Typography>
  },
  {
    key: 'studentName',
    headerLabel: 'Người khiếu nại',
    type: 'string',
    renderCell: (data) => {
      return data.studentId ? (
        <Typography>{data.studentId}</Typography>
      ) : (
        <Typography>Chưa có thông tin</Typography>
      );
    }
  },
  {
    key: 'reportedAt',
    headerLabel: 'Ngày khiếu nại',
    type: 'string',
    renderCell: (data) => {
      return data.reportedAt ? (
        <Typography>{formatDate(formatUnixTimestamp(data.reportedAt))}</Typography>
      ) : (
        <Typography>Chưa có thông tin</Typography>
      );
    }
  },
  {
    key: 'content',
    headerLabel: 'Nội dung khiếu nại',
    type: 'string',
    renderCell: (data) => (
      <Typography>{data.content ? data.content : 'Không có nội dung'}</Typography>
    )
  },
  {
    key: 'repliedAt',
    headerLabel: 'Ngày phản hồi',
    type: 'string',
    renderCell: (data) => (
      <Typography>
        {data.status === 'REPLIED' && data.repliedAt
          ? formatDate(formatUnixTimestamp(data.repliedAt))
          : 'Chưa phản hồi'}
      </Typography>
    )
  },
  {
    key: 'reply',
    headerLabel: 'Nội dung phản hồi',
    type: 'string',
    renderCell: (data) => (
      <Typography>
        {data.reply && data.status === 'REPLIED' ? data.reply : 'Chưa có nội dung'}
      </Typography>
    )
  },
  {
    key: 'status',
    headerLabel: 'Trạng thái',
    type: 'string',
    renderCell: (data) => (
      <Chip
        variant='filled'
        label={data.status === 'REPLIED' ? 'Đã phản hồi' : 'Đang chờ xử lý'}
        color={
          data.status === 'REPLIED' ? 'success' : data.status === 'PENDING' ? 'warning' : 'error'
        }
      />
    )
  },
  {
    key: 'action',
    headerLabel: 'Hành động',
    type: 'string',
    renderCell: (data) => (
      <Stack direction={'row'} spacing={2}>
        <Tooltip title='PHẢN HỒI KHIẾU NẠI'>
          <ArrowForward
            color='blue'
            size={24}
            className='cursor-pointer'
            onClick={(event) => {
              event.stopPropagation();
              onClickReply(data);
            }}
          />
        </Tooltip>
        <Tooltip title='TỪ CHỐI KHIẾU NẠI'>
          <CloseCircle
            color='red'
            size={24}
            className='cursor-pointer'
            onClick={(event) => {
              event.stopPropagation();
              onClickDeny(data);
            }}
          />
        </Tooltip>
      </Stack>
    )
  }
];

export default getReportTableConfig;
