import { Typography, Stack, Chip } from '@mui/material';
import { CustomTableConfig } from 'src/components/custom-table';
import { Edit, Trash } from 'iconsax-react';
import { DeliveryDetail } from 'src/types/delivery';
import { formatDate, formatUnixTimestamp } from 'src/utils/format-time-currency';
import { shortenUUID } from 'src/utils/shorten-id';

const getDeliveryTableConfig = ({}: {}): CustomTableConfig<
  DeliveryDetail['id'],
  DeliveryDetail
>[] => {
  const configs: CustomTableConfig<DeliveryDetail['id'], DeliveryDetail>[] = [
    {
      key: 'id',
      headerLabel: 'Mã chuyển đi',
      type: 'string',
      renderCell: (data) => <Typography>{data.displayId}</Typography>
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
    }
  ];

  return configs;
};

export default getDeliveryTableConfig;
