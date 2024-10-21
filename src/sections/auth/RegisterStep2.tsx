import React from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { Mail } from 'lucide-react';

function RegisterStep2() {
  return (
    <Box display={'flex'} flexDirection={'column'} alignItems={'center'} width={'40%'} gap={2}>
      <Box className='flex items-center justify-center w-16 h-16 rounded-full bg-green-300 border-8 border-green-500'>
        <Mail color='white' />
      </Box>
      <Stack alignItems={'center'}>
        <Typography variant='h5' sx={{ wordSpacing: '0.2rem' }}>
          Kiểm tra email của bạn
        </Typography>
        <Box display={'flex'} alignItems={'center'} gap={1}>
          <Typography variant='body2'>Chưa nhận được email?</Typography>
          <Typography className='italic underline opacity-40'>Gửi lại</Typography>
        </Box>
      </Stack>
    </Box>
  );
}

export default RegisterStep2;
