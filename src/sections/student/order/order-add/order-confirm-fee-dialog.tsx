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

function OrderConfirmFeeDialog({
  formik,
  shippingFee,
  onConfirm,
  onConfirmPayment,
  ...dialogProps
}: DialogProps & {
  formik: FormikProps<OrderFormProps>;
  shippingFee: number;
  onConfirm?: () => Promise<void>;
  onConfirmPayment?: () => Promise<void>;
}) {
  const onConfirmHelper = useFunction(onConfirm!, {});
  const onConfirmPaymentHelper = useFunction(onConfirmPayment!, {});
  const orderInfoList = useMemo(() => {
    return [
      {
        title: 'Mã đơn hàng',
        value: '#' + formik.values.checkCode
      },
      {
        title: 'Thương hiệu',
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
        value: formik.values.deliveryDate
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
            Xác nhận thông tin đơn hàng
          </Typography>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
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
        <Divider className='my-3' />
        <Typography variant='h6' textAlign={'center'} color='primary' fontWeight={'bold'}>
          Bạn có chắc chắn muốn thêm những đơn hàng này?
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
            await onConfirmHelper.call({});
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
