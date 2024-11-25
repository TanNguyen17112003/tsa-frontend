import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Divider,
  Slide,
  SlideProps,
  Typography
} from '@mui/material';
import { OrderDetail } from 'src/types/order';
import Image from 'next/image';
import fakeShipper from 'public/ui/background-auth.png';
import OrderProgress from './order-progress';

interface OrderDeliveryDialogProps {
  open: boolean;
  onClose: () => void;
  order: OrderDetail;
}

const Transition = React.forwardRef(function Transition(
  props: SlideProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />;
});

const OrderDeliveryDialog: React.FC<OrderDeliveryDialogProps> = ({ open, onClose, order }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='sm'
      fullWidth
      TransitionComponent={Transition}
      sx={{
        '& .MuiDialog-paper': {
          position: 'fixed',
          bottom: 0,
          margin: 0,
          width: '100%',
          height: '60vh',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16
        }
      }}
    >
      <DialogTitle className='self-center mb-2'>Tiến độ đơn hàng</DialogTitle>
      <DialogContent sx={{ maxHeight: '50vh', overflowY: 'auto' }}>
        {order?.shipperId ? (
          <Stack direction={'row'} gap={3} alignItems={'center'}>
            <Image
              src={(order?.staffInfo?.photoUrl as string) || fakeShipper}
              alt='staffName'
              width={50}
              height={50}
            />
            <Stack>
              <Typography>
                {order?.staffInfo?.lastName} {order?.staffInfo?.firstName}
              </Typography>
              <Typography>{order?.staffInfo?.phoneNumber}</Typography>
            </Stack>
          </Stack>
        ) : (
          <Typography color='error' fontWeight={'bold'} textAlign={'center'}>
            Chưa có nhân viên chỉ định
          </Typography>
        )}
        <OrderProgress order={order} />
      </DialogContent>
    </Dialog>
  );
};

export default OrderDeliveryDialog;
