import { Download, Edit } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography
} from '@mui/material';
import { format } from 'date-fns';
import React, { useCallback } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useDrawer } from 'src/hooks/use-drawer';
import useFunction from 'src/hooks/use-function';
import { OrderDetail } from 'src/types/order';
import { orderStatusIconList } from 'src/types/order';
import { formatVNDcurrency } from 'src/utils/format-time-currency';
import OrderDetailCancelDialog from 'src/sections/student/order/order-list/order-detail-cancel-dialog';
import OrderReceiveExternalDialog from '../order-list/order-receive-external-dialog';
import OrderCompleteDialog from '../order-list/order-complete-dialog';
import { useOrdersContext } from 'src/contexts/orders/orders-context';
import { useDialog } from '@hooks';

function OrderInfoCard({ order }: { order: OrderDetail }) {
  const { updateOrderStatus } = useOrdersContext();
  const [updatedStatus, setUpdatedStatus] = useState<string>('');
  const orderDetailCancelDialog = useDialog<OrderDetail>();
  const orderReceiveExternalDialog = useDialog<OrderDetail>();
  const orderCompleteDialog = useDialog<OrderDetail>();

  const handleUpdateOrderStatus = useCallback(async () => {
    try {
      const updatedOrder = await updateOrderStatus({ status: updatedStatus as any }, [order?.id]);
    } catch (error) {
      throw error;
    }
  }, [updatedStatus, updateOrderStatus]);

  const handleOpenDialog = useCallback(() => {
    if (updatedStatus == 'CANCELED') {
      orderDetailCancelDialog.handleOpen(order);
    } else if (updatedStatus == 'RECEIVED_EXTERNAL') {
      orderReceiveExternalDialog.handleOpen(order);
    } else {
      orderCompleteDialog.handleOpen(order);
    }
  }, [updatedStatus]);

  const handleUpdateOrderStatusHelper = useFunction(handleUpdateOrderStatus, {
    successMessage: 'Cập nhật trạng thái đơn hàng thành công!'
  });

  const boxFields = [
    {
      name: 'Mã đơn hàng',
      value: '#' + (order?.checkCode || '123')
    },
    {
      name: 'Sản phẩm',
      value: order?.product ? order?.product : 'Không có sản phẩm nào'
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
      name: 'Giao dịch',
      value: order?.isPaid ? (
        <Chip variant='filled' color='success' label='Đã thanh toán' />
      ) : (
        <Chip variant='filled' color='warning' label='Chưa thanh toán' />
      )
    },
    {
      name: 'Nhân viên phụ trách',
      value: order?.shipperId ? order?.shipperId : 'Chưa được chỉ định'
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
              : order?.latestStatus === 'CANCELED'
                ? 'Đã hủy'
                : order?.latestStatus === 'ACCEPTED'
                  ? 'Đã xác nhận'
                  : order?.latestStatus === 'RECEIVED_EXTERNAL'
                    ? 'Đã nhận hàng'
                    : 'Đã từ chối'
    }
  ];

  return (
    <>
      {order && (
        <Card className='pt-4 pb-2 border border-divider' elevation={5}>
          <Box className='flex justify-between gap-4 items-center pb-4 px-6 w-full'>
            <Typography variant='h6'>Thông tin chung</Typography>
            <Stack
              direction={'row'}
              gap={2}
              alignItems={'center'}
              justifyContent={'center'}
              className='w-[500px]'
            >
              <FormControl fullWidth>
                <Select
                  variant='filled'
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  value={updatedStatus}
                  label='Lựa chọn trạng thái để cập nhật'
                  onChange={(e) => setUpdatedStatus(e.target.value)}
                >
                  {orderStatusIconList.map((status) => {
                    return (
                      <MenuItem value={status.status} key={status.status}>
                        <Box display={'flex'} alignItems={'center'} gap={1}>
                          {React.cloneElement(status.icon, { style: { color: status.color } })}
                          <Typography color={status.color} fontWeight={'bold'}>
                            {status.title}
                          </Typography>
                        </Box>
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <Button
                className='h-full'
                variant='contained'
                fullWidth
                onClick={
                  updatedStatus == 'CANCELED' ||
                  updatedStatus == 'RECEIVED_EXTERNAL' ||
                  updatedStatus == 'DELIVERED'
                    ? handleOpenDialog
                    : handleUpdateOrderStatusHelper.call
                }
              >
                Cập nhật
              </Button>
            </Stack>
          </Box>
          {boxFields.map((boxField, index) => {
            return (
              <>
                <Box className='flex items-center py-3 px-6' key={index}>
                  <Typography variant='subtitle1' className='w-[300px]'>
                    {boxField.name}
                  </Typography>
                  {boxField.name === 'Trạng thái' ? (
                    <Chip
                      label={boxField.value}
                      color={
                        boxField.value === 'Đã xác nhận' ||
                        boxField.value === 'Đã giao' ||
                        boxField.value === 'Đã nhận hàng'
                          ? 'success'
                          : boxField.value === 'Đã hủy' || boxField.value === 'Đã từ chối'
                            ? 'error'
                            : boxField.value === 'Đang chờ xử lý'
                              ? 'warning'
                              : 'primary'
                      }
                    />
                  ) : (
                    <Typography className='flex-1'>{boxField.value}</Typography>
                  )}
                </Box>
                {index == boxFields.length - 1 ? null : <Divider />}
              </>
            );
          })}
          <OrderDetailCancelDialog
            order={order}
            open={orderDetailCancelDialog.open}
            onClose={orderDetailCancelDialog.handleClose}
            type='ADMIN'
          />
          <OrderReceiveExternalDialog
            order={order}
            open={orderReceiveExternalDialog.open}
            onClose={orderReceiveExternalDialog.handleClose}
          />
          <OrderCompleteDialog
            order={order}
            open={orderCompleteDialog.open}
            onClose={orderCompleteDialog.handleClose}
          />
        </Card>
      )}
    </>
  );
}

export default OrderInfoCard;
