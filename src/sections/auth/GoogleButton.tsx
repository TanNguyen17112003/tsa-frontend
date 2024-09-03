import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import googleIcon from 'public/ui/google-icon.png';
import Image from 'next/image';

function GoogleButton() {
  return (
    <Button
      sx={{
        bgcolor: 'white',
        borderWidth: 1,
        borderColor: 'black',
        borderStyle: 'solid',
        borderRadius: 'full'
      }}
      className='flex gap-3'
    >
      <Box height={'100%'}>
        <Image src={googleIcon} height='20' objectFit='cover' alt='Google' />
      </Box>
      <Typography color='black' fontWeight={'bold'}>
        Đăng nhập với Google
      </Typography>
    </Button>
  );
}

export default GoogleButton;
