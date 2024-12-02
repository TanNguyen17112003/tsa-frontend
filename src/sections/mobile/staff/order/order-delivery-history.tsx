import React from 'react';
import { OrderDetail } from 'src/types/order';
import { Box, Typography, Stack, IconButton } from '@mui/material';
import { ArrowLeft } from 'iconsax-react';
import { useRouter } from 'next/router';
import OrderMap from './order-map';

const MobileOrderDeliveryHistory: React.FC<{ order: OrderDetail }> = ({ order }) => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <Box className='bg-white min-h-screen text-black relative'>
      <Stack direction='row' alignItems='center' className='absolute top-4 left-4 z-10'>
        <IconButton onClick={handleGoBack}>
          <ArrowLeft />
        </IconButton>
      </Stack>
      <OrderMap order={order} />
    </Box>
  );
};

export default MobileOrderDeliveryHistory;
