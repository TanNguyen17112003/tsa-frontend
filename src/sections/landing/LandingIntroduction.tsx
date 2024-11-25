import React, { useCallback } from 'react';
import Image from 'next/image';
import { Typography, Button, Box, Card, useMediaQuery, useTheme } from '@mui/material';

import landingLogo1 from '../../../public/ui/landing-logo-1.png';
import food from '../../../public/ui/food.png';
import technology from '../../../public/ui/technology.png';
import medicine from '../../../public/ui/medicine.png';
import { useRouter } from 'next/router';
import { paths } from 'src/paths';

const introductionList = [
  {
    goods: 'Đồ ăn',
    image: food
  },
  {
    goods: 'Công nghệ',
    image: technology
  },
  {
    goods: 'Dược phẩm',
    image: medicine
  }
];

export const LandingIntroduction = () => {
  const router = useRouter();
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleGoToLogin = useCallback(() => {
    router.push(paths.auth.login);
  }, [router]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        color: 'text.primary',
        backgroundColor: '#f6fdf5'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column-reverse' : 'start',
          alignItems: 'center',
          p: 8,
          gap: isMobile ? 2 : 4,
          height: '100vh'
        }}
      >
        <Box
          sx={{
            flexBasis: isMobile ? '100%' : '50%',
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? 2 : 4
          }}
        >
          {isMobile && (
            <Typography textAlign={'center'} fontSize={20} fontWeight={'bold'} color='green'>
              Giao hàng nhanh chóng đến tận nơi của bạn
            </Typography>
          )}
          {!isMobile && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: isMobile ? 'row' : 'column',
                gap: isMobile ? 0.5 : 1,
                textTransform: 'uppercase',
                alignItems: isMobile ? 'center' : 'flex-start',
                justifyContent: isMobile ? 'center' : 'flex-start',
                height: isMobile ? '100%' : 'auto'
              }}
            >
              <Typography
                fontWeight={'bold'}
                color='#63AC5E'
                fontSize={isMobile ? '1rem' : isTablet ? '1.5rem' : '1.75rem'}
              >
                Giao hàng
              </Typography>
              <Typography
                fontWeight={'bold'}
                fontSize={isMobile ? '1rem' : isTablet ? '1.5rem' : '1.75rem'}
              >
                Nhanh chóng
              </Typography>
              <Typography
                fontWeight={'bold'}
                fontSize={isMobile ? '1rem' : isTablet ? '1.5rem' : '1.75rem'}
              >
                Đến tận nơi của bạn
              </Typography>
            </Box>
          )}
          <Typography
            fontWeight={'light'}
            fontSize={isMobile ? '1rem' : isTablet ? '1.25rem' : '1.5rem'}
            textAlign={isMobile ? 'center' : 'left'}
          >
            Dịch vụ chuyển phát chúng tôi đa dạng các mặt hàng từ đồ ăn, món hàng công nghệ, đồ gia
            dụng hay các đồ mỹ phẩm
          </Typography>
          <Button variant='contained' color='secondary' onClick={handleGoToLogin}>
            Đặt hàng ngay
          </Button>
          {!isMobile && !isTablet && (
            <Box
              width={'100%'}
              sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 4, userSelect: 'none' }}
            >
              {introductionList.map((item, index) => (
                <Card
                  key={index}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                    padding: 2,
                    borderRadius: 2,
                    width: '33.33%'
                  }}
                >
                  <Image src={item.image} alt='image' width={50} />
                  <Typography variant='body1'>{item.goods}</Typography>
                </Card>
              ))}
            </Box>
          )}
        </Box>
        <Box sx={{ flexBasis: '50%' }}>
          <Image
            src={landingLogo1}
            alt='landing-logo-1'
            className='w-full h-full'
            quality={100}
            priority
          />
        </Box>
      </Box>
    </Box>
  );
};
