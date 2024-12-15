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
import React from 'react';
import Image from 'next/image';
import successDeliveryImage from 'public/ui/success-delivery-2.png';

function OrderSucceedDialog({
  onConfirm,
  ...dialogProps
}: DialogProps & {
  onConfirm?: () => void;
}) {
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
          <Image src={successDeliveryImage} alt='payment-alert' />
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box className='flex flex-col gap-1 items-center'>
          <Typography>Đơn hàng của bạn vừa được giao tới</Typography>
          <Typography variant='body1' fontWeight={'bold'}>
            Hãy xuống lấy hàng và kiểm tra kỹ nhé!
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions className='flex justify-center'>
        <Button
          variant='contained'
          color='success'
          onClick={async (e) => {
            dialogProps.onClose?.(e, 'escapeKeyDown');
            onConfirm?.();
          }}
        >
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default OrderSucceedDialog;
