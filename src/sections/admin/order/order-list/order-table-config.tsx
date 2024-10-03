import { Typography, Stack, Chip } from '@mui/material';
import { CustomTableConfig } from 'src/components/custom-table';
import { OrderDetail } from 'src/types/order';
import { Edit, DocumentText, Trash } from 'iconsax-react';
import { formatDate, formatUnixTimestamp, formatVNDcurrency } from 'src/utils/format-time-currency';

const getOrderTableConfigs = ({
  onClickDelete,
  onClickEdit
}: {
  onClickDelete: (data: OrderDetail) => void;
  onClickEdit: (data: OrderDetail) => void;
}): CustomTableConfig<OrderDetail['id'], OrderDetail>[] => [
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
    key: 'weight',
    headerLabel: 'Khối lượng (kg)',
    type: 'string',
    renderCell: (data) => <Typography>{data.weight}</Typography>
  },
  {
    key: 'studentName',
    headerLabel: 'Khách hàng',
    type: 'string',
    renderCell: (data) => <Typography>{data.studentId}</Typography>
  },
  {
    key: 'shipperName',
    headerLabel: 'Nhân viên phụ trách',
    type: 'string',
    renderCell: (data) => (
      <Typography>{data.shipperId ? data.shipperId : 'Nhân viên chưa được chỉ định'}</Typography>
    )
  },
  {
    key: 'address',
    headerLabel: 'Địa chỉ',
    type: 'string',
    renderCell: (data) => <Typography>{'P.' + data.room + '-' + 'T.' + data.building}</Typography>
  },
  {
    key: 'deliveryDate',
    headerLabel: 'Ngày giao hàng',
    type: 'string',
    renderCell: (data) => {
      return <Typography>{formatDate(formatUnixTimestamp(data.deliveryDate))}</Typography>;
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
              : 'Đã hủy'
        }
        color={
          data.latestStatus === 'DELIVERED'
            ? 'success'
            : data.latestStatus === 'PENDING'
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

export default getOrderTableConfigs;
