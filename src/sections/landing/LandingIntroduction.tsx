import React from 'react';
import Image from 'next/image';
import logo from '../../../public/logo.png';
import {
  TextField,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Card,
  InputAdornment,
  Link
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AuthButton from 'src/pages/landing/authButton';
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

const navigationList = [
  {
    title: 'FAQs',
    link: '#'
  },
  {
    title: 'Liên hệ',
    link: '#'
  },
  {
    title: 'Về chúng tôi',
    link: '#'
  }
];

export const LandingIntroduction = () => {
  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        height: '100vh',
        width: '100vw',
        color: 'text.primary'
      }}
    >
      <AppBar position='static' sx={{ backgroundColor: 'background.paper', color: 'text.primary' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', paddingY: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Image src={logo} alt='logo' width={50} />
            <Typography variant='h5' component='span' sx={{ fontWeight: 'bold', color: '#5BE23D' }}>
              TSA
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {navigationList.map((item, index) => (
              <Link key={index} href={item.link} underline='none' color='inherit'>
                <Typography variant='body1'>{item.title}</Typography>
              </Link>
            ))}
            <TextField
              variant='outlined'
              placeholder='Tìm kiếm đơn hàng'
              sx={{ maxWidth: 200, borderRadius: 5, px: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
            <AuthButton />
          </Box>
        </Toolbar>
      </AppBar>
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
