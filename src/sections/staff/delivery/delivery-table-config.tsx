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
            data.DeliveryStatusHistory[0].status === 'FINISHED'
              ? 'Hoàn thành'
              : data.DeliveryStatusHistory[0].status === 'CANCELED'
                ? 'Đã hủy'
                : data.DeliveryStatusHistory[0].status === 'PENDING'
                  ? 'Đang chờ xử lý'
                  : data.DeliveryStatusHistory[0].status === 'ACCEPTED'
                    ? 'Đã xác nhận'
                    : ''
          }
          color={
            data.DeliveryStatusHistory[0].status === 'FINISHED' ||
            data.DeliveryStatusHistory[0].status === 'ACCEPTED'
              ? 'success'
              : data.DeliveryStatusHistory[0].status === 'PENDING'
                ? 'warning'
                : 'error'
          }
        />
      )
    }
  ];

  return configs;
};

export default getDeliveryTableConfig;
