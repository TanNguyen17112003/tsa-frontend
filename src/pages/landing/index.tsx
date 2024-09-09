import {
  LandingFooter,
  LandingAboutUs,
  LandingIntroduction,
  LandingContact,
  LandingFeatures,
  LandingFlow
} from '@sections';
import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { LandingHeader } from 'src/sections/landing/LandingHeader';

const LandingPage = () => {
  useEffect(() => {
    const handleScroll = (event: WheelEvent) => {
      event.preventDefault();
      const sections = document.querySelectorAll('.section');
      const currentSectionIndex = Array.from(sections).findIndex((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top >= 0 && rect.top < window.innerHeight / 2;
      });

      if (event.deltaY > 0 && currentSectionIndex < sections.length - 1) {
        sections[currentSectionIndex + 1].scrollIntoView({ behavior: 'smooth' });
      } else if (event.deltaY < 0 && currentSectionIndex > 0) {
        sections[currentSectionIndex - 1].scrollIntoView({ behavior: 'smooth' });
      }
    };

    window.addEventListener('wheel', handleScroll, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, []);

  return (
    <>
      <LandingHeader />
      <Box className='section' sx={{ height: '100vh' }}>
        <LandingIntroduction />
      </Box>
      <Box className='section' sx={{ height: '100vh' }}>
        <LandingAboutUs />
      </Box>
      <Box className='section' sx={{ height: '100vh' }}>
        <LandingFlow />
      </Box>
      <Box className='section' sx={{ height: '100vh' }}>
        <LandingFeatures />
      </Box>
      <Box className='section' sx={{ height: '100vh' }}>
        <LandingContact />
        <LandingFooter />
      </Box>
    </>
  );
};

export default LandingPage;
