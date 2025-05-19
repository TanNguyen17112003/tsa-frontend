import { Typography, Stack, Chip } from '@mui/material';
import { CustomTableConfig } from 'src/components/custom-table';
import { TicketDetail } from 'src/types/ticket';
import { Edit, DocumentText, Trash } from 'iconsax-react';
import { formatDate, formatUnixTimestamp, formatVNDcurrency } from 'src/utils/format-time-currency';
import { formatDatetime } from '@utils';

const getTicketTableConfigs = ({}: {}): CustomTableConfig<TicketDetail['id'], TicketDetail>[] => [
  {
    key: 'ticketId',
    headerLabel: 'Id câu hỏi/yêu cầu',
    type: 'string',
    renderCell: (data) => <Typography>#{data.displayId}</Typography>
  },
  {
    key: 'subject',
    headerLabel: 'Chủ đề',
    type: 'string',
    renderCell: (data) => <Typography>{data.title}</Typography>
  },
  {
    key: 'status',
    headerLabel: 'Trạng thái',
    type: 'string',
    renderCell: (data) =>
      data.status === 'PENDING' ? (
        <Chip label='Đang mở' color='primary' />
      ) : data.status === 'PROCESSING' ? (
        <Chip label='Đang trao đổi' color='warning' />
      ) : (
        <Chip label='Đã hoàn thành' color='success' />
      )
  },
  {
    key: 'number of replies',
    headerLabel: 'Số lượng trả lời',
    type: 'string',
    renderCell: (data) => <Typography>{data.replies.length}</Typography>
  },
  {
    key: 'time',
    headerLabel: 'Thời gian',
    type: 'string',
    renderCell: (data) => <Typography>{formatDatetime(data.createdAt as Date)}</Typography>
  }
];

export default getTicketTableConfigs;
