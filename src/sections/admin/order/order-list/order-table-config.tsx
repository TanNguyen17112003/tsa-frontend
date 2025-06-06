import { Typography, Stack, Chip, Box, Tooltip } from '@mui/material';
import { CustomTableConfig } from 'src/components/custom-table';
import { OrderDetail } from 'src/types/order';
import { Edit, DocumentText, Trash, CloseCircle, Security, Check } from 'iconsax-react';
import { formatDate, formatUnixTimestamp, formatVNDcurrency } from 'src/utils/format-time-currency';
import { UserDetail } from 'src/types/user';
import { Verified } from 'lucide-react';

const getOrderTableConfigs = ({
  onClickDelete,
  onClickEdit,
  onClickCancel,
  onClickReceiveExternal,
  users
}: {
  onClickDelete: (data: OrderDetail) => void;
  onClickEdit: (data: OrderDetail) => void;
  onClickCancel: (data: OrderDetail) => void;
  onClickReceiveExternal: (data: OrderDetail) => void;
  users: UserDetail[];
}): CustomTableConfig<OrderDetail['id'], OrderDetail>[] => [
  {
    key: 'checkCode',
    headerLabel: 'Mã đơn hàng',
    type: 'string',
    renderCell: (data) => {
      const isContainingReceiveStatus = data.historyTime
        .map((historyItem) => historyItem.status)
        .includes('RECEIVED_EXTERNAL');

      return (
        <Stack direction={'row'} alignItems={'center'} gap={1}>
          <Typography>#{data.checkCode}</Typography>
          {isContainingReceiveStatus && (
            <Tooltip title='Đơn hàng này đã được nhận từ bên ngoài'>
              <Verified color='green' fontVariant={'contained'} />
            </Tooltip>
          )}
        </Stack>
      );
    }
  },
  {
    key: 'receivedImage',
    headerLabel: 'Minh chứng nhận hàng',
    type: 'string',
    renderCell: (data) => {
      const handleClick = () => {
        window.open(data.receivedImage as string, '_blank');
      };
      return data.receivedImage ? (
        <Box className='cursor-pointer' onClick={handleClick}>
          <img src={data.receivedImage as string} alt='proof' width={100} />
        </Box>
      ) : (
        <Typography>Chưa có thông tin</Typography>
      );
    }
  },
  {
    key: 'finishedImage',
    headerLabel: 'Minh chứng giao hàng',
    type: 'string',
    renderCell: (data) => {
      const handleClick = () => {
        window.open(data.finishedImage as string, '_blank');
      };
      return data.finishedImage ? (
        <Box className='cursor-pointer' onClick={handleClick}>
          <img src={data.finishedImage as string} alt='proof' width={100} />
        </Box>
      ) : (
        <>Chưa có thông tin</>
      );
    }
  },
  {
    key: 'canceledImage',
    headerLabel: 'Minh chứng hủy đơn',
    type: 'string',
    renderCell: (data) => {
      const listImage = data.historyTime
        .filter((item) => item.canceledImage !== null && item.canceledImage?.length > 0)
        .map((item) => item.canceledImage);
      const handleClick = (index: number) => {
        window.open(listImage[index] as string, '_blank');
      };
      return listImage?.length > 0 ? (
        <Stack direction={'row'} spacing={1}>
          {listImage.map((image, index) => (
            <Box key={index} className='cursor-pointer' onClick={() => handleClick(index)}>
              <img src={image as string} alt='proof' width={100} />
            </Box>
          ))}
        </Stack>
      ) : (
        <>Chưa có thông tin</>
      );
    }
  },
  {
    key: 'brand',
    headerLabel: 'Sàn thương mại',
    type: 'string',
    renderCell: (data) => <Typography>{data.brand}</Typography>
  },
  {
    key: 'product',
    headerLabel: 'Sản phẩm',
    type: 'string',
    renderCell: (data) =>
      data.product ? (
        <Typography>
          {data.product.startsWith(', ') ? data.product.slice(2) : data.product}
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
    renderCell: (data) => {
      const foundUser = users.find((user) => user.id === data.studentId);
      return data.studentId && foundUser ? (
        <Typography>{foundUser.lastName + ' ' + foundUser.firstName}</Typography>
      ) : (
        <Typography>Chưa có thông tin</Typography>
      );
    }
  },
  {
    key: 'shipperName',
    headerLabel: 'Nhân viên phụ trách',
    type: 'string',
    renderCell: (data) => {
      const foundUser = users.find((user) => user.id === data.studentId);
      return (
        <Typography>
          {data.shipperId && foundUser
            ? foundUser.lastName + foundUser.firstName
            : 'Chưa được chỉ định'}
        </Typography>
      );
    }
  },
  {
    key: 'address',
    headerLabel: 'Địa chỉ',
    type: 'string',
    renderCell: (data) => {
      return data.room && data.building && data.dormitory ? (
        <Typography>{'P.' + data.room + '-' + 'T.' + data.building}</Typography>
      ) : (
        <Typography>Chưa có thông tin</Typography>
      );
    }
  },
  {
    key: 'deliveryDate',
    headerLabel: 'Ngày giao hàng',
    type: 'string',
    renderCell: (data) => {
      return data.deliveryDate ? (
        <Typography>{formatDate(formatUnixTimestamp(data.deliveryDate))}</Typography>
      ) : (
        <Typography>Chưa có thông tin</Typography>
      );
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
    key: 'isPaid',
    headerLabel: 'Thanh toán',
    type: 'string',
    renderCell: (data) => {
      return data.isPaid ? (
        <Chip label='Đã thanh toán' color='success' />
      ) : (
        <Chip label='Chưa thanh toán' color='warning' />
      );
    }
  },
  {
    key: 'paymentMethod',
    headerLabel: 'Phương thức thanh toán',
    renderCell: (data) => {
      return (
        <Typography>
          {data.paymentMethod === 'MOMO'
            ? 'Qua Momo'
            : data.paymentMethod === 'CREDIT'
              ? 'Qua ngân hàng'
              : 'Tiền mặt'}
        </Typography>
      );
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
            : data.latestStatus === 'IN_TRANSPORT'
              ? 'Đang giao'
              : data.latestStatus === 'PENDING'
                ? 'Đang chờ xử lý'
                : data.latestStatus === 'CANCELED'
                  ? 'Đã hủy'
                  : data.latestStatus === 'ACCEPTED'
                    ? 'Đã chấp nhận'
                    : data.latestStatus === 'RECEIVED_EXTERNAL'
                      ? 'Đã nhận hàng'
                      : 'Đã từ chối'
        }
        color={
          data.latestStatus === 'DELIVERED' ||
          data.latestStatus === 'ACCEPTED' ||
          data.latestStatus === 'RECEIVED_EXTERNAL'
            ? 'success'
            : data.latestStatus === 'PENDING' || data.latestStatus === 'IN_TRANSPORT'
              ? 'warning'
              : 'error'
        }
      />
    )
  },

  {
    key: 'cancelReason',
    headerLabel: 'Lý do hủy đơn',
    renderCell: (data) => {
      const listReason = data.historyTime
        .filter((item) => item.reason !== null && (item.reason?.length ?? 0) > 0)
        .map((item) => item.reason);
      return listReason?.length > 0 ? (
        <Typography>{listReason.join(', ')}</Typography>
      ) : (
        <>Chưa có thông tin</>
      );
    }
  },
  {
    key: 'action',
    headerLabel: 'Hành động',
    type: 'string',
    renderCell: (data) => (
      <Stack direction={'row'} spacing={2}>
        <Tooltip title='Chỉnh sửa đơn hàng'>
          <Edit
            color='blue'
            size={24}
            className='cursor-pointer'
            onClick={(event) => {
              event.stopPropagation();
              onClickEdit(data);
            }}
          />
        </Tooltip>
        <Tooltip title='Xóa đơn hàng'>
          <Trash
            color='red'
            size={24}
            className='cursor-pointer'
            onClick={(event) => {
              event.stopPropagation();
              onClickDelete(data);
            }}
          />
        </Tooltip>

        {data.latestStatus !== 'CANCELED' && data.latestStatus !== 'DELIVERED' && (
          <Tooltip title='Hủy đơn hàng'>
            <CloseCircle
              color='red'
              size={24}
              className='cursor-pointer'
              onClick={(event) => {
                event.stopPropagation();
                onClickCancel(data);
              }}
            />
          </Tooltip>
        )}
        {data.latestStatus === 'ACCEPTED' && (
          <Tooltip title='Xác nhận đơn từ bên ngoài'>
            <Verified
              color='green'
              size={24}
              className='cursor-pointer'
              onClick={(event) => {
                event.stopPropagation();
                onClickReceiveExternal(data);
              }}
            />
          </Tooltip>
        )}
      </Stack>
    )
  }
];

export default getOrderTableConfigs;
