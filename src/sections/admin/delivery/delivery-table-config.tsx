import { Typography, Stack, Chip } from '@mui/material';
import { CustomTableConfig } from 'src/components/custom-table';
import { Edit, Trash } from 'iconsax-react';
import { DeliveryDetail } from 'src/types/delivery';
import { formatDate, formatUnixTimestamp } from 'src/utils/format-time-currency';
import { shortenUUID } from 'src/utils/shorten-id';

const getDeliveryTableConfig = ({
  onClickDelete,
  onClickEdit,
  staffs
}: {
  onClickDelete: (data: DeliveryDetail) => void;
  onClickEdit: (data: DeliveryDetail) => void;
  staffs: { [key: string]: { firstName: string; lastName: string } };
}): CustomTableConfig<DeliveryDetail['id'], DeliveryDetail>[] => [
  {
    key: 'id',
    headerLabel: 'Mã chuyển đi',
    type: 'string',
    renderCell: (data) => <Typography>{data.displayId}</Typography>
  },
  {
    key: 'shipperName',
    headerLabel: 'Nhân viên phụ trách',
    type: 'string',
    renderCell: (data) => {
      const staff = staffs[data.staffId];
      return <Typography>{staff ? `${staff.lastName} ${staff.firstName}` : 'N/A'}</Typography>;
    }
  },
  {
    key: 'numberOfOrders',
    headerLabel: 'Số lượng đơn hàng',
    type: 'string',
    renderCell: (data) => <Typography>{data?.numberOrder}</Typography>
  },
  {
    key: 'deliveryDate',
    headerLabel: 'Thời gian tạo chuyến đi',
    type: 'string',
    renderCell: (data) => (
      <Typography>{formatDate(formatUnixTimestamp(data.createdAt as string))}</Typography>
    )
  },
  {
    key: 'status',
    headerLabel: 'Trạng thái',
    type: 'string',
    renderCell: (data) => (
      <Chip
        variant='filled'
        label={
          data?.latestStatus === 'FINISHED'
            ? 'Hoàn thành'
            : data?.latestStatus === 'CANCELED'
              ? 'Đã hủy'
              : data?.latestStatus === 'PENDING'
                ? 'Đang chờ xử lý'
                : data?.latestStatus === 'ACCEPTED'
                  ? 'Đã xác nhận'
                  : ''
        }
        color={
          data?.latestStatus === 'FINISHED' || data?.latestStatus === 'ACCEPTED'
            ? 'success'
            : data?.latestStatus === 'PENDING'
              ? 'warning'
              : 'error'
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
