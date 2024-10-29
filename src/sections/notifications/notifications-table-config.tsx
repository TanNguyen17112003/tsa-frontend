import { Typography, Stack, Button, Chip, Box } from '@mui/material';
import { CustomTableConfig } from 'src/components/custom-table';
import { paths } from 'src/paths';
import { Edit, Trash } from 'iconsax-react';
import { formatUnixTimestamp, formatDate } from 'src/utils/format-time-currency';
import { OrderDetail } from 'src/types/order';
import { NotificationDetail } from 'src/types/notification';

const getNotificationsTableConfig = ({}: {}): CustomTableConfig<
  NotificationDetail['id'],
  NotificationDetail
>[] => [
  {
    key: 'type',
    headerLabel: 'Chủ đề',
    type: 'string',
    renderCell: (data) => (
      <Chip
        label={
          data.type === 'ORDER' ? 'Đơn hàng' : data.type === 'REPORT' ? 'Khiếu nại' : 'Chuyến đi'
        }
        color={data.type === 'ORDER' ? 'primary' : data.type === 'REPORT' ? 'warning' : 'error'}
      />
    )
  },
  {
    key: 'createdAt',
    headerLabel: 'Thời gian',
    type: 'string',
    renderCell: (data) => <Typography>{formatDate(formatUnixTimestamp(data.createdAt))}</Typography>
  },
  {
    key: 'title',
    headerLabel: 'Tiêu đề',
    type: 'string',
    renderCell: (data) => <Typography>{data.title}</Typography>
  },
  {
    key: 'content',
    headerLabel: 'Nội dung phản hồi',
    type: 'string',
    renderCell: (data) => <Typography>{data.content}</Typography>
  }
];

export default getNotificationsTableConfig;
