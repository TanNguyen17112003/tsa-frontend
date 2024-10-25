import type { FC } from 'react';
import BackgroundImage from '../../../public/ui/background-auth.png';
import { Stack, Typography } from '@mui/material';

export const Logo: FC = () => {
  return (
    <Stack spacing={2} justifyContent={'center'} alignItems={'center'}>
      <img src={BackgroundImage.src} alt='logo' width='50%' height='50%' />
      <Typography color='black' fontWeight={'bold'} fontSize={24}>
        Hệ thống đang khởi động, vui lòng đợi...{' '}
      </Typography>
    </Stack>
  );
};
