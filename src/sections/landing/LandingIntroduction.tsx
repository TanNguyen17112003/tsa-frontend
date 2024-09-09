import React from 'react';
import Image from 'next/image';
import { Typography, Button, Box, Card } from '@mui/material';

import landingLogo1 from '../../../public/ui/landing-logo-1.png';
import food from '../../../public/ui/food.png';
import technology from '../../../public/ui/technology.png';
import medicine from '../../../public/ui/medicine.png';

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
  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        height: '100vh',
        color: 'text.primary'
      }}
    >
      <Box
        component='main'
        sx={{ display: 'flex', alignItems: 'center', p: 8, gap: 4, backgroundColor: '#f6fdf5' }}
      >
        <Box sx={{ flexBasis: '50%', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              typography: 'h2',
              fontWeight: 'bold',
              textTransform: 'uppercase'
            }}
          >
            <Typography variant='h2' sx={{ color: '#63AC5E' }}>
              GIAO HÀNG
            </Typography>
            <Typography variant='h2'>NHANH CHÓNG</Typography>
            <Typography variant='h2'>ĐẾN TẬN NƠI CỦA BẠN</Typography>
          </Box>
          <Typography variant='body1' sx={{ fontWeight: 'light', fontSize: '1.25rem' }}>
            Dịch vụ chuyển phát chúng tôi đa dạng các mặt hàng từ đò ăn, món hàng công nghệ, đồ gia
            dụng hay các đồ mỹ phẩm
          </Typography>
          <Button variant='contained' color='secondary'>
            Đặt hàng ngay
          </Button>
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
