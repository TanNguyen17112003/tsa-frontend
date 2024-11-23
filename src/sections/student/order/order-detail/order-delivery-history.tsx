import React, { useMemo } from 'react';
import OrderProgress from './order-progress';
import OrderStaff from './order-staff';
import OrderMap from './order-map';
import { Stack, Box, Typography, Divider } from '@mui/material';
import { OrderDetail } from 'src/types/order';
import noEmployeeImage from 'public/ui/no-employee.jpg';
import Image from 'next/image';
import { TickCircle } from 'iconsax-react';

interface OrderDeliveryHistoryProps {
  order: OrderDetail;
}

const OrderDeliveryHistory: React.FC<OrderDeliveryHistoryProps> = ({ order }) => {
  return (
    <Box display='flex' gap={2} className='min-h-[500px]'>
      <Stack spacing={3} width='40%'>
        <OrderProgress order={order} />
        <Divider className='border-black' />
        {order.shipperId ? (
          <OrderStaff order={order} />
        ) : (
          <Stack gap={2}>
            <Typography variant='h6'>Thông tin nhân viên phụ trách</Typography>
            <Typography fontWeight={'bold'} color='error'>
              Đơn hàng chưa được chỉ định!
            </Typography>
            <Image
              src={noEmployeeImage}
              alt='No employee'
              width={300}
              height={300}
              className='self-center'
            />
          </Stack>
        )}
      </Stack>
      <Stack width='60%' className='h-[100%]'>
        {order.latestStatus === 'DELIVERED' ? (
          <Stack
            gap={2}
            alignItems={'center'}
            justifyContent={'center'}
            height={'100%'}
            className='bg-green-500'
          >
            <TickCircle color='white' size={50} />
            <Typography color='white' variant='h5'>
              Đơn hàng #{order.checkCode} của bạn đã được giao thành công!
            </Typography>
          </Stack>
        ) : (
          <OrderMap order={order} />
        )}
      </Stack>
    </Box>
  );
};

export default OrderDeliveryHistory;
