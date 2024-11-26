import type { FC } from 'react';
import BackgroundImage from '../../../public/ui/background-auth.png';
import { Stack, Typography } from '@mui/material';
import { useResponsive } from 'src/utils/use-responsive';

export const Logo: FC = () => {
  const { isTablet, isMobile } = useResponsive();
  return (
    <Stack spacing={2} justifyContent={'center'} alignItems={'center'}>
      <img src={BackgroundImage.src} alt='logo' width='50%' height='50%' />
      <Typography
        color='black'
        fontWeight={'bold'}
        variant={isMobile ? 'subtitle2' : isTablet ? 'body2' : 'h5'}
      >
        Hệ thống đang khởi động, vui lòng đợi...{' '}
      </Typography>
    </Stack>
  );
};
