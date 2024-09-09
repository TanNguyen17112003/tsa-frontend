import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import AuthButton from 'src/pages/landing/authButton';
import { AppBar, Toolbar, Box, Typography, Link, InputAdornment, TextField } from '@mui/material';
import Image from 'next/image';
import logo from '../../../public/logo.png';

export const LandingHeader = () => {
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
  return (
    <AppBar position='fixed' sx={{ backgroundColor: 'background.paper', color: 'text.primary' }}>
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
  );
};
