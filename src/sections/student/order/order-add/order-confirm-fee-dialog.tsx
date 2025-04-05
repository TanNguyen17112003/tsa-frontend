import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  DialogProps,
  Typography,
  DialogContent,
  Stack,
  Divider
} from '@mui/material';
import { Box } from '@mui/system';
import React, { useMemo } from 'react';
import useFunction from 'src/hooks/use-function';
import { getShippingFee } from 'src/utils/shipping-fee';
import { formatVNDcurrency } from 'src/utils/format-time-currency';
import { FormikProps } from 'formik';
import { OrderFormProps } from 'src/api/orders';
import Carousel from 'react-material-ui-carousel';

function OrderConfirmFeeDialog({
  orders,
  formik,
  shippingFee,
  onConfirm,
  onConfirmPayment,
  ...dialogProps
}: DialogProps & {
  orders: OrderFormProps[];
  formik: FormikProps<OrderFormProps>;
  shippingFee: number;
  onConfirm?: () => Promise<void>;
  onConfirmPayment?: () => Promise<void>;
}) {
  const onConfirmPaymentHelper = useFunction(onConfirmPayment!, {});
  const orderInfoList = useMemo(() => {
    return [
      {
        title: 'Mã đơn hàng',
        value: '#' + formik.values.checkCode
      },
      {
        title: 'Sàn thương mại',
        value: formik.values.brand
      },
      {
        title: 'Khối lượng',
        value: formik.values.weight + ' kg'
      },
      {
        title: 'Sản phẩm',
        value: formik.values.product?.startsWith(', ')
          ? formik.values.product.slice(2)
          : formik.values.product
      },
      {
        title: 'Thời gian giao hàng',
        value: `${formik.values.deliveryDay} / ${formik.values.deliveryTimeSlot}`
      },
      {
        title: 'Địa chỉ',
        value:
          'P.' +
          formik.values.room +
          ', ' +
          'T.' +
          formik.values.building +
          ', ' +
          'KTX Khu ' +
          formik.values.dormitory
      },
      {
        title: 'Phương thức thanh toán',
        value: formik.values.paymentMethod === 'CASH' ? 'TIỀN MẶT' : 'CHUYỂN KHOẢN'
      },
      {
        title: 'Phí vận chuyển',
        value: formatVNDcurrency(shippingFee)
      }
    ];
  }, [formik.values, shippingFee]);

  return (
    <Dialog fullWidth maxWidth='md' {...dialogProps}>
      <DialogTitle>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Typography variant='h5' color='error'>
            Xác nhận thông tin {orders.length > 0 ? orders.length : ''} đơn hàng
          </Typography>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        {orders.length === 0 && (
          <Box className='flex flex-col gap-1'>
            {orderInfoList.map((item, index) => (
              <Stack key={index} direction={'row'} gap={0.5} justifyContent='space-between'>
                <Typography variant='body1'>{item.title}:</Typography>
                <Typography variant='body1' fontWeight={'bold'}>
                  {item.value}
                </Typography>
              </Stack>
            ))}
          </Box>
        )}
        {orders.length > 0 && (
          <Carousel animation='slide'>
            {orders.map((order, index) => (
              <Box key={index} className='flex flex-col gap-1'>
                <Stack key={index} direction={'row'} gap={0.5} justifyContent='space-between'>
                  <Typography variant='body1'>Mã đơn hàng:</Typography>
                  <Typography variant='body1' fontWeight={'bold'}>
                    #{order.checkCode}
                  </Typography>
                </Stack>
                <Stack key={index} direction={'row'} gap={0.5} justifyContent='space-between'>
                  <Typography variant='body1'>Sàn thương mại:</Typography>
                  <Typography variant='body1' fontWeight={'bold'}>
                    {order.brand}
                  </Typography>
                </Stack>
                <Stack key={index} direction={'row'} gap={0.5} justifyContent='space-between'>
                  <Typography variant='body1'>Khối lượng:</Typography>
                  <Typography variant='body1' fontWeight={'bold'}>
                    {order.weight} kg
                  </Typography>
                </Stack>
                <Stack key={index} direction={'row'} gap={0.5} justifyContent='space-between'>
                  <Typography variant='body1'>Sản phẩm:</Typography>
                  <Typography variant='body1' fontWeight={'bold'}>
                    {order.product}
                  </Typography>
                </Stack>
                <Stack key={index} direction={'row'} gap={0.5} justifyContent='space-between'>
                  <Typography variant='body1'>Thời gian giao hàng:</Typography>
                  <Typography variant='body1' fontWeight={'bold'}>
                    {order.deliveryDay}
                  </Typography>
                </Stack>
                <Stack key={index} direction={'row'} gap={0.5} justifyContent='space-between'>
                  <Typography variant='body1'>Địa chỉ:</Typography>
                  <Typography variant='body1' fontWeight={'bold'}>
                    P.{order.room}, T.{order.building}, KTX Khu {order.dormitory}
                  </Typography>
                </Stack>
                <Stack key={index} direction={'row'} gap={0.5} justifyContent='space-between'>
                  <Typography variant='body1'>Phương thức thanh toán:</Typography>
                  <Typography variant='body1' fontWeight={'bold'}>
                    {order.paymentMethod === 'CASH' ? 'TIỀN MẶT' : 'CHUYỂN KHOẢN'}
                  </Typography>
                </Stack>
                <Stack key={index} direction={'row'} gap={0.5} justifyContent='space-between'>
                  <Typography variant='body1'>Phí vận chuyển:</Typography>
                  <Typography variant='body1' fontWeight={'bold'} color='error'>
                    {formatVNDcurrency(
                      getShippingFee(
                        order.room as string,
                        order.building as string,
                        order.dormitory as string,
                        order.weight as number
                      )
                    )}
                  </Typography>
                </Stack>
              </Box>
            ))}
          </Carousel>
        )}
        <Divider className='my-3' />
        <Typography variant='h6' textAlign={'center'} color='primary' fontWeight={'bold'}>
          Bạn có chắc chắn muốn thêm {orders.length > 0 ? 'những' : ''} đơn hàng này?
        </Typography>
      </DialogContent>
      <DialogActions className='flex justify-end'>
        <Button
          variant='contained'
          color={'inherit'}
          onClick={(e) => {
            dialogProps.onClose?.(e, 'escapeKeyDown');
          }}
        >
          Hủy
        </Button>
        <Button
          variant='contained'
          color='primary'
          onClick={async (e) => {
            dialogProps.onClose?.(e, 'escapeKeyDown');
            await onConfirm?.call({});
          }}
        >
          {formik.values.paymentMethod !== 'CASH' ? 'Xác nhận và thanh toán sau' : 'Xác nhận'}
        </Button>
        {formik.values.paymentMethod !== 'CASH' && (
          <Button
            variant='contained'
            color='primary'
            onClick={async (e) => {
              dialogProps.onClose?.(e, 'escapeKeyDown');
              await onConfirmPaymentHelper.call({});
            }}
          >
            Thanh toán và thêm đơn hàng
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default OrderConfirmFeeDialog;
