import { Typography, Stack, Chip } from '@mui/material';
import { CustomTableConfig } from 'src/components/custom-table';
import { Edit, DocumentText, Trash } from 'iconsax-react';
import { DeliveryDetail } from 'src/types/delivery';
import { formatDate, formatUnixTimestamp, formatVNDcurrency } from 'src/utils/format-time-currency';

const getDeliveryTableConfig = ({
  onClickDelete,
  onClickEdit
}: {
  onClickDelete: (data: DeliveryDetail) => void;
  onClickEdit: (data: DeliveryDetail) => void;
}): CustomTableConfig<DeliveryDetail['id'], DeliveryDetail>[] => [
  {
    key: 'id',
    headerLabel: 'Mã chuyển đi',
    type: 'string',
    renderCell: (data) => <Typography>#{data.id}</Typography>
  },
  {
    key: 'shipperName',
    headerLabel: 'Nhân viên phụ trách',
    type: 'string',
    renderCell: (data) => <Typography>{data.shipperId}</Typography>
  },
  {
    key: 'deliveryDate',
    headerLabel: 'Thời gian bắt đầu chuyển',
    type: 'string',
    renderCell: (data) => (
      <Typography>{formatDate(formatUnixTimestamp(data.deliveryAt as string))}</Typography>
    )
  },
  {
    key: 'limitTime',
    headerLabel: 'Thời gian giới hạn (phút)',
    type: 'string',
    renderCell: (data) => <Typography>{data.limitTime}</Typography>
  },
  {
    key: 'delayTime',
    headerLabel: 'Thời gian trễ (phút)',
    type: 'string',
    renderCell: (data) => <Typography>{data.delayTime}</Typography>
  },
  {
    key: 'status',
    headerLabel: 'Trạng thái',
    type: 'string',
    renderCell: (data) => (
      <Chip
        variant='filled'
        label={
          data.status === 'SUCCESS'
            ? 'Hoàn thành'
            : data.status === 'PENDING'
              ? 'Đang chờ xử lý'
              : 'Đã chấp nhận'
        }
        color={
          data.status === 'SUCCESS' ? 'success' : data.status === 'PENDING' ? 'warning' : 'error'
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
        <Edit
          color='blue'
          size={24}
          className='cursor-pointer'
          onClick={(event) => {
            event.stopPropagation();
            onClickEdit(data);
          }}
        />
        <Trash
          color='red'
          size={24}
          className='cursor-pointer'
          onClick={(event) => {
            event.stopPropagation();
            onClickDelete(data);
          }}
        />
      </Stack>
    )
  }
];

export default getDeliveryTableConfig;
