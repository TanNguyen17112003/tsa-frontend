import { Typography, Stack, Chip } from '@mui/material';
import { CustomTableConfig } from 'src/components/custom-table';
import { OrderDetail } from 'src/types/order';
import { formatDate, formatUnixTimestamp, formatVNDcurrency } from 'src/utils/format-time-currency';

const getOrderTableConfigs = ({}: {}): CustomTableConfig<OrderDetail['id'], OrderDetail>[] => {
  const configs: CustomTableConfig<OrderDetail['id'], OrderDetail>[] = [
    {
      key: 'checkCode',
      headerLabel: 'Mã đơn hàng',
      type: 'string',
      renderCell: (data) => <Typography>#{data.checkCode}</Typography>
    },
    {
      key: 'product',
      headerLabel: 'Sản phẩm',
      type: 'string',
      renderCell: (data) =>
        data.product ? (
          <Typography>
            {data.product[0] == ',' && data.product[1] == ' '
              ? data.product.substring(2)
              : data.product}
          </Typography>
        ) : (
          <Typography>Không có sản phẩm nào</Typography>
        )
    },
    {
      key: 'address',
      headerLabel: 'Địa chỉ',
      type: 'string',
      renderCell: (data) => (
        <Typography>
          {'P.' + data.room + '-' + 'T.' + data.building + '-' + 'KTX khu ' + data.dormitory}
        </Typography>
      )
    },
    {
      key: 'weight',
      headerLabel: 'Khối lượng',
      type: 'string',
      renderCell: (data) => {
        return <Typography>{data.weight + ' kg'}</Typography>;
      }
    },
    {
      key: 'shippingFee',
      headerLabel: 'Tổng tiền (VNĐ)',
      type: 'string',
      renderCell: (data) => {
        return <Typography>{formatVNDcurrency(data.shippingFee)}</Typography>;
      }
    },
    {
      key: 'deliveryDate',
      headerLabel: 'Ngày đăng ký nhận hàng',
      type: 'string',
      renderCell: (data) => {
        return <Typography>{formatDate(formatUnixTimestamp(data.deliveryDate))}</Typography>;
      }
    },
    {
      key: 'paymentMethod',
      headerLabel: 'Phương thức thanh toán',
      type: 'string',
      renderCell: (data) => (
        <Typography>
          {data.paymentMethod === 'CASH'
            ? 'Khi nhận hàng'
            : data.paymentMethod === 'CREDIT'
              ? 'Qua ngân hàng'
              : 'Qua Momo'}
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
          label={
            data.latestStatus === 'DELIVERED'
              ? 'Đã giao'
              : data.latestStatus === 'PENDING'
                ? 'Chờ xử lý'
                : data.latestStatus === 'CANCELLED'
                  ? 'Đã hủy'
                  : data.latestStatus === 'REJECTED'
                    ? 'Đã từ chối'
                    : data.latestStatus === 'IN_TRANSPORT'
                      ? 'Đang vận chuyển'
                      : data.latestStatus === 'ACCEPTED'
                        ? 'Đã xác nhận'
                        : 'Không xác định'
          }
          color={
            data.latestStatus === 'DELIVERED' || data.latestStatus === 'ACCEPTED'
              ? 'success'
              : data.latestStatus === 'PENDING' || data.latestStatus === 'IN_TRANSPORT'
                ? 'warning'
                : 'error'
          }
        />
      )
    }
  ];

  return configs;
};

export default getOrderTableConfigs;
