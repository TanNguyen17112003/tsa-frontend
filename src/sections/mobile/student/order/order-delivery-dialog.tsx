import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  Slide,
  SlideProps,
  Typography
} from '@mui/material';
import { OrderDetail } from 'src/types/order';
import Image from 'next/image';
import fakeShipper from 'public/ui/background-auth.png';
import OrderProgress from './order-progress';
import { useResponsive } from 'src/utils/use-responsive';

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
  const { isMobile } = useResponsive();
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      TransitionComponent={Transition}
      sx={{
        '& .MuiDialog-paper': {
          position: 'fixed',
          bottom: isMobile ? 0 : undefined,
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
