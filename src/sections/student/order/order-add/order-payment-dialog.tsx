import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  DialogProps,
  Typography,
  DialogContent
} from '@mui/material';
import { Box } from '@mui/system';
import React, { useMemo } from 'react';
import useFunction from 'src/hooks/use-function';
import Image from 'next/image';
import paymentImage from 'public/ui/payment-alert.jpg';
import { XIcon } from 'lucide-react';

function OrderPaymentDialog({
  onConfirm,
  onAlternativeConfirm,
  ...dialogProps
}: DialogProps & {
  onConfirm?: () => Promise<void>;
  onAlternativeConfirm?: () => Promise<void>;
}) {
  const onConfirmHelper = useFunction(onConfirm!, {});

  const onAlternativeConfirmHelper = useFunction(onAlternativeConfirm!, {});

  return (
    <Dialog fullWidth maxWidth='xs' {...dialogProps}>
      <DialogTitle>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            position: 'relative'
          }}
        >
          <Image src={paymentImage} alt='payment-alert' />
          <XIcon
            size={24}
            onClick={() => dialogProps.onClose}
            className='absolute top-1 right-1 cursor-pointer'
          />
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box className='flex flex-col gap-1 items-center'>
          <Typography>Đơn hàng chỉ được xử lý khi bạn thanh toán</Typography>
          <Typography variant='body1' fontWeight={'bold'}>
            Bạn có muốn thanh toán ngay bây giờ không?
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions className='flex justify-center'>
        <Button
          variant='contained'
          color={'inherit'}
          onClick={async (e) => {
            dialogProps.onClose?.(e, 'escapeKeyDown');
            await onAlternativeConfirmHelper.call({});
          }}
        >
          Để sau
        </Button>
        <Button
          variant='contained'
          color='success'
          onClick={async (e) => {
            dialogProps.onClose?.(e, 'escapeKeyDown');
            await onConfirmHelper.call({});
          }}
        >
          Thanh toán ngay
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default OrderPaymentDialog;
