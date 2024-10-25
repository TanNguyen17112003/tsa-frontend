import { IconButton, Typography, Stack, Button, Chip, Box } from '@mui/material';
import { CustomTableConfig } from 'src/components/custom-table';
import { paths } from 'src/paths';
import { Edit, Trash } from 'iconsax-react';
import { ReportDetail } from 'src/types/report';
import { formatUnixTimestamp, formatDate } from 'src/utils/format-time-currency';
import { OrderDetail } from 'src/types/order';

const getReportTableConfigs = ({
  onClickEdit,
  onClickRemove,
  orders
}: {
  onClickEdit: (data: ReportDetail) => void;
  onClickRemove: (data: ReportDetail) => void;
  orders: OrderDetail[];
}): CustomTableConfig<ReportDetail['id'], ReportDetail>[] => [
  {
    key: 'orderCode',
    headerLabel: 'Mã đơn hàng',
    type: 'string',
    renderCell: (data) => {
      const dataOrder = orders.find((order) => order.id === data.orderId);
      return <Typography>#{dataOrder?.checkCode}</Typography>;
    }
  },
  {
    key: 'reportedAt',
    headerLabel: 'Ngày khiếu nại',
    type: 'string',
    renderCell: (data) => (
      <Typography>{formatDate(formatUnixTimestamp(data.reportedAt!))}</Typography>
    )
  },
  {
    key: 'content',
    headerLabel: 'Nội dung khiếu nại',
    type: 'string'
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
    headerLabel: 'Phản hồi',
    type: 'string',
    renderCell: (data) => <Typography>{data.reply ? data.reply : 'Chưa có phản hồi'}</Typography>
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
