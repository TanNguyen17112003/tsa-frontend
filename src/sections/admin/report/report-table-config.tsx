import { Typography, Stack, Chip, Tooltip, Box } from '@mui/material';
import { CustomTableConfig } from 'src/components/custom-table';
import { ArrowForward, CloseCircle } from 'iconsax-react';
import { formatDate, formatUnixTimestamp } from 'src/utils/format-time-currency';
import { ReportDetail } from 'src/types/report';
import { OrderDetail } from 'src/types/order';
import { UserDetail } from 'src/types/user';

const getReportTableConfig = ({
  onClickDeny,
  onClickReply,
  orders,
  users
}: {
  onClickDeny: (data: ReportDetail) => void;
  onClickReply: (data: ReportDetail) => void;
  orders: OrderDetail[];
  users: UserDetail[];
}): CustomTableConfig<ReportDetail['id'], ReportDetail>[] => [
  {
    key: 'checkCode',
    headerLabel: 'Mã đơn hàng',
    type: 'string',
    renderCell: (data) => (
      <Typography>#{orders?.find((order) => order.id === data.orderId)?.checkCode}</Typography>
    )
  },
  {
    key: 'studentName',
    headerLabel: 'Người khiếu nại',
    type: 'string',
    renderCell: (data) => {
      const student = users?.find((user) => user.id === data.studentId);
      return student ? (
        <Typography>
          {student?.lastName} {student?.firstName}
        </Typography>
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
    key: 'proof',
    headerLabel: 'Minh chứng',
    type: 'string',
    renderCell: (data) => {
      const handleClick = () => {
        window.open(data.proof as string, '_blank');
      };
      return (data.proof as string).endsWith('.jpg') || (data.proof as string).endsWith('.png') ? (
        <Box className='cursor-pointer' onClick={handleClick}>
          <img src={data.proof as string} alt='proof' width={100} />
        </Box>
      ) : (
        <Typography>{data.proof as string}</Typography>
      );
    }
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
        <Tooltip title='XÓA KHIẾU NẠI'>
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
