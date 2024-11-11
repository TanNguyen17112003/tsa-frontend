import React from 'react';
import { Card, Stack, Typography, Avatar, Button } from '@mui/material';
import { Message } from 'iconsax-react';
import avatarPerson from 'public/ui/person.jpg';
import { OrderDetail } from 'src/types/order';

interface OrderStaffProps {
  order: OrderDetail;
}

const OrderStaff: React.FC<OrderStaffProps> = ({ order }) => {
  return (
    <Stack spacing={2}>
      <Typography variant='h6'>Thông tin nhân viên phụ trách</Typography>
      <Card className='flex items-center gap-5 py-2 px-3'>
        <Stack alignItems={'center'} spacing={1}>
          <Avatar alt={'Ảnh chân dung'} src={avatarPerson.src} className='w-20 h-20' />
          <Button variant='contained' color='success' startIcon={<Message size={24} />}>
            Nhắn tin
          </Button>
        </Stack>
        <Stack spacing={2}>
          <Typography>
            Họ và tên: {order.lastName} {order.firstName}
          </Typography>
        </Stack>
      </Card>
    </Stack>
  );
};

export default OrderStaff;
