import { Download, Edit } from '@mui/icons-material';
import { Box, Button, Card, Divider, Stack, Tooltip, Typography } from '@mui/material';
import { format } from 'date-fns';
import { useEffect, useMemo } from 'react';
import { useDrawer } from 'src/hooks/use-drawer';
import useFunction from 'src/hooks/use-function';
import { OrderDetail } from 'src/types/order';
import OrderDetailReportDrawer from '../order-list/order-detail-report-drawer';

function OrderInfoCard({ order }: { order: OrderDetail }) {
  const orderDetailReportDrawer = useDrawer<OrderDetail>();

  const boxFields = [
    {
      name: 'Mã đơn hàng',
      value: '#' + order.code
    },
    {
      name: 'Sản phẩm',
      value: order.product.join(', ')
    },
    {
      name: 'Địa chỉ giao hàng',
      value: order.address
    },
    {
      name: 'Ngày giao hàng',
      value: order.deliveryDate
    },
    {
      name: 'Đơn giá',
      value: order.amount
    },
    {
      name: 'Phương thức thanh toán',
      value:
        order.paymentMethod === 'BANK'
          ? 'Qua ngân hàng'
          : order.paymentMethod === 'MOMO'
            ? 'Qua MoMo'
            : 'Tiền mặt'
    },
    {
      name: 'Nhân viên phụ trách',
      value: 'Nguyễn Hoàng Duy Tân'
    },
    {
      name: 'Trạng thái',
      value:
        order.status === 'DELIVERED'
          ? 'Đã giao'
          : order.status === 'IN_TRANSPORT'
            ? 'Đang giao'
            : order.status === 'PENDING'
              ? 'Đang chờ xử lý'
              : order.status === 'CANCELLED'
                ? 'Đã hủy'
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
      <OrderDetailReportDrawer
        open={orderDetailReportDrawer.open}
        onClose={orderDetailReportDrawer.handleClose}
      />
    </>
  );
}

export default OrderInfoCard;
