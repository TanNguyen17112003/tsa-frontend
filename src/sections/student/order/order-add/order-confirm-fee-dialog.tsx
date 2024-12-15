import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  DialogProps,
  Typography,
  DialogContent,
  Stack
} from '@mui/material';
import { Box } from '@mui/system';
import React, { useMemo } from 'react';
import useFunction from 'src/hooks/use-function';
import { getShippingFee } from 'src/utils/shipping-fee';
import { formatVNDcurrency } from 'src/utils/format-time-currency';

function OrderConfirmFeeDialog({
  shippingFee,
  onConfirm,
  ...dialogProps
}: DialogProps & {
  shippingFee: number;
  onConfirm?: () => Promise<void>;
}) {
  const onConfirmHelper = useFunction(onConfirm!, {});

  return (
    <Dialog fullWidth maxWidth='xs' {...dialogProps}>
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
            Xác nhận phí vận chuyển
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box className='flex flex-col gap-1'>
          <Stack direction={'row'} gap={0.5}>
            <Typography variant='body1'>Phí vận chuyển là:</Typography>
            <Typography variant='body1' fontWeight={'bold'}>
              {formatVNDcurrency(shippingFee)}
            </Typography>
          </Stack>
          <Typography variant='body1'>Bạn có chắc chắn muốn thêm những đơn hàng này?</Typography>
        </Box>
      </DialogContent>
      <DialogActions className='flex justify-center'>
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
          Chấp nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default OrderConfirmFeeDialog;
