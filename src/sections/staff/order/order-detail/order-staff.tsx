import React from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { OrderDetail } from 'src/types/order';
import { Phone } from 'lucide-react';

interface OrderStaffProps {
  order: OrderDetail;
}

const OrderStaff: React.FC<OrderStaffProps> = ({ order }) => {
  const handleCallClick = () => {
    if (order?.staffInfo?.phoneNumber) {
      window.location.href = `tel:${order.staffInfo.phoneNumber}`;
    }
  };

  return (
    <Stack spacing={3}>
      <Stack direction={'row'} justifyContent={'space-between'} alignContent={'center'}>
        <Typography variant='h5' color='primary'>
          Thông tin nhân viên phụ trách
        </Typography>
        <Button
          variant='contained'
          color='warning'
          startIcon={<Phone size={20} />}
          onClick={handleCallClick}
        >
          Gọi ngay
        </Button>
      </Stack>
      <Stack spacing={3}>
        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
          <Typography fontWeight={'bold'}>Họ và tên:</Typography>
          <Typography>
            {order?.staffInfo?.lastName} {order?.staffInfo?.firstName}
          </Typography>
        </Stack>
        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
          <Typography fontWeight={'bold'}>Số điện thoại:</Typography>
          <Typography>{order?.staffInfo?.phoneNumber}</Typography>
        </Stack>
        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
          <Typography fontWeight={'bold'}>Địa chỉ đơn hàng:</Typography>
          <Typography>
            P.{order.room}, T.{order.building}, KTX khu {order.dormitory}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default OrderStaff;
