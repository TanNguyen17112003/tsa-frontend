import { Typography, Stack, Chip } from '@mui/material';
import { CustomTableConfig } from 'src/components/custom-table';
import { Edit, Trash } from 'iconsax-react';
import { DeliveryDetail } from 'src/types/delivery';
import { formatDate, formatUnixTimestamp } from 'src/utils/format-time-currency';

const getDeliveryTableConfig = ({}: {}): CustomTableConfig<
  DeliveryDetail['id'],
  DeliveryDetail
>[] => {
  const configs: CustomTableConfig<DeliveryDetail['id'], DeliveryDetail>[] = [
    {
      key: 'id',
      headerLabel: 'Mã chuyển đi',
      type: 'string',
      renderCell: (data) => <Typography>#{data.id}</Typography>
    },
    {
      key: 'numberOfOrders',
      headerLabel: 'Số lượng đơn hàng',
      type: 'string',
      renderCell: (data) => <Typography>{data?.orders?.length}</Typography>
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
      key: 'limitTime',
      headerLabel: 'Thời gian giới hạn (phút)',
      type: 'string',
      renderCell: (data) => <Typography>{data.limitTime}</Typography>
    },
    {
      key: 'status',
      headerLabel: 'Trạng thái',
      type: 'string',
      renderCell: (data) => (
        <Chip
          variant='filled'
          label={
            data.status === 'FINISHED'
              ? 'Hoàn thành'
              : data.status === 'CANCELED'
                ? 'Đã hủy'
                : data.status === 'PENDING'
                  ? 'Đang chờ xử lý'
                  : 'Chấp nhận'
          }
          color={
            data.status === 'FINISHED'
              ? 'success'
              : data.status === 'PENDING'
                ? 'warning'
                : data.status === 'ACCEPTED'
                  ? 'primary'
                  : 'error'
          }
        />
      )
    }
  ];

  return configs;
};

export default getDeliveryTableConfig;
