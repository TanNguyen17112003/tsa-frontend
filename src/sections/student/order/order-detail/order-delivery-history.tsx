import React from 'react';
import OrderProgress from './order-progress';
import OrderStaff from './order-staff';
import OrderMap from './order-map';
import { Stack, Box, Typography, Avatar } from '@mui/material';

function OrderDeliveryHistory() {
  return (
    <Box display='flex' gap={2} alignItems={'center'}>
      <Stack spacing={3} width='40%'>
        <OrderProgress />
        <OrderStaff />
      </Stack>
      <Stack width='60%'>
        <OrderMap />
      </Stack>
    </Box>
  );
}

export default OrderDeliveryHistory;
