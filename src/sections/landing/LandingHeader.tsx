import React, { useCallback, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import AuthButton from 'src/pages/landing/authButton';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Link,
  InputAdornment,
  TextField,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
  Divider,
  Stack
} from '@mui/material';
import Image from 'next/image';
import logo from '../../../public/logo.png';
import { useRouter } from 'next/router';
import { paths } from 'src/paths';

export const LandingHeader = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const navigationList = [
    {
      title: 'FAQs',
      link: '#faqs'
    },
    {
      title: 'Liên hệ',
      link: '#contact'
    },
    {
      title: 'Về chúng tôi',
      link: '#about-us'
    }
  ];

  const handleLinkClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement | HTMLDivElement | HTMLLIElement>, link: string) => {
      event.preventDefault();
      const targetElement = document.querySelector(link);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
      setDrawerOpen(false);
    },
    []
  );

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawerList = (
    <Box
      sx={{ width: 250 }}
      role='presentation'
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {navigationList.map((item, index) => (
          <ListItem
            className='cursor-pointer hover:bg-green-100'
            key={index}
            onClick={(event: React.MouseEvent<HTMLLIElement, MouseEvent>) =>
              handleLinkClick(event, item.link)
            }
          >
            <ListItemText primary={item.title} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position='fixed' sx={{ backgroundColor: 'background.paper', color: 'text.primary' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', paddingY: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Image src={logo} alt='logo' width={50} />
          <Typography variant='h5' component='span' sx={{ fontWeight: 'bold', color: '#5BE23D' }}>
            TSA
          </Typography>
        </Box>
        {isMobile ? (
          <>
            <IconButton edge='end' color='inherit' aria-label='menu' onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer anchor='right' open={drawerOpen} onClose={toggleDrawer(false)}>
              <Stack className='px-4 py-3'>
                <Typography fontWeight={'bold'}>Các thông tin bổ sung</Typography>
              </Stack>
              <Divider />
              {drawerList}
              <Divider />
              <Stack
                className='px-4 py-3 cursor-pointer hover:bg-green-100'
                onClick={() => {
                  router.push(paths.auth.login);
                }}
              >
                <Typography fontWeight={'bold'} color='green'>
                  Đăng nhập
                </Typography>
              </Stack>
              <Stack
                className='px-4 py-3 cursor-pointer hover:bg-green-100'
                onClick={() => {
                  router.push(paths.auth.register.index);
                }}
              >
                <Typography fontWeight={'bold'}>Đăng ký</Typography>
              </Stack>
            </Drawer>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {navigationList.map((item, index) => (
              <Link
                key={index}
                href={item.link}
                underline='none'
                color='inherit'
                onClick={(event) => handleLinkClick(event, item.link)}
              >
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
        )}
      </Toolbar>
    </AppBar>
  );
};
