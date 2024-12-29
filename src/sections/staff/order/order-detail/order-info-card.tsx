import { Box, Button, Card, Chip, Divider, Typography } from '@mui/material';
import { useDrawer } from 'src/hooks/use-drawer';
import { OrderDetail } from 'src/types/order';
import { formatVNDcurrency } from 'src/utils/format-time-currency';

function OrderInfoCard({ order }: { order: OrderDetail }) {
  const orderDetailReportDrawer = useDrawer<OrderDetail>();
  const boxFields = [
    {
      name: 'Mã đơn hàng',
      value: '#' + (order?.checkCode || '123')
    },
    {
      name: 'Sản phẩm',
      value: order?.product ? order?.product.substring(2) : 'Không có sản phẩm nào'
    },
    {
      name: 'Địa chỉ giao hàng',
      value:
        'Phòng ' +
        order?.room +
        ', ' +
        'Tòa ' +
        order?.building +
        ', ' +
        'KTX khu ' +
        order?.dormitory
    },
    {
      name: 'Đơn giá',
      value: formatVNDcurrency(order?.shippingFee)
    },
    {
      name: 'Giao dịch',
      value: order?.isPaid ? (
        <Chip variant='filled' color='success' label='Đã thanh toán' />
      ) : (
        <Chip variant='filled' color='warning' label='Chưa thanh toán' />
      )
    },
    {
      name: 'Khối lượng',
      value: order?.weight + ' kg'
    },
    {
      name: 'Phương thức thanh toán',
      value:
        order?.paymentMethod === 'CREDIT'
          ? 'Qua ngân hàng'
          : order?.paymentMethod === 'MOMO'
            ? 'Qua MoMo'
            : 'Tiền mặt'
    },
    {
      name: 'Nhân viên phụ trách',
      value: order?.shipperId
        ? order?.staffInfo.lastName + '' + order?.staffInfo.firstName
        : 'Chưa được chỉ định'
    },
    {
      name: 'Trạng thái',
      value:
        order?.latestStatus === 'DELIVERED'
          ? 'Đã giao'
          : order?.latestStatus === 'IN_TRANSPORT'
            ? 'Đang giao'
            : order?.latestStatus === 'PENDING'
              ? 'Đang chờ xử lý'
              : order?.latestStatus === 'CANCELLED'
                ? 'Đã hủy'
                : order?.latestStatus === 'ACCEPTED'
                  ? 'Đã xác nhận'
                  : 'Đã từ chối'
    }
  ];

  return (
    <>
      {order && (
        <Card className='pt-4 pb-2 border border-divider' elevation={5}>
          <Box className='flex justify-between gap-4 items-center pb-4 px-6'>
            <Typography variant='h6'>Thông tin chung</Typography>
            <Button
              variant='contained'
              className='bg-[#34a853]'
              onClick={() => orderDetailReportDrawer.handleOpen()}
            >
              Khiếu nại
            </Button>
          </Box>

          {boxFields.map((boxField, index) => {
            return (
              <>
                <Box className='flex items-center py-3 px-6' key={index}>
                  <Typography variant='subtitle1' className='w-[300px]'>
                    {boxField.name}
                  </Typography>
                  <Typography className='flex-1'>{boxField.value}</Typography>
                </Box>
                {index == boxFields.length - 1 ? null : <Divider />}
              </>
            );
          })}
        </Card>
      )}
    </>
  );
}

export default OrderInfoCard;
