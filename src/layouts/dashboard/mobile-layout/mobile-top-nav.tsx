import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Box, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Image from 'next/image';
import logo from 'public/logo.png';
import { MobileNav } from './mobile-nav';
import { Section } from '../config/config';

interface MobileTopNavProps {
  sections: Section[];
}

const MobileTopNav: React.FC<MobileTopNavProps> = ({ sections }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  return (
    <>
      <AppBar position='fixed' sx={{ backgroundColor: '#34a853', color: 'white' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Image src={logo} alt='logo' width={40} height={40} />
            <Typography fontWeight={'bold'} color='white' fontSize={20}>
              TSA
            </Typography>
          </Box>
          <IconButton edge='end' color='inherit' aria-label='menu' onClick={handleDrawerOpen}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Toolbar /> {/* This is to offset the AppBar height */}
      <MobileNav open={drawerOpen} onClose={handleDrawerClose} sections={sections} />
    </>
  );
};

export default MobileTopNav;
