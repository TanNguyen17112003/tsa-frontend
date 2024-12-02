import { Box, Typography, Stack, Divider, Grid, Link } from '@mui/material';
import React from 'react';
import Image from 'next/image';
import logo from '../../../public/bold-mobile-logo.png';
import { Facebook, Instagram, Youtube } from 'iconsax-react';

interface FooterLinkProps {
  title: string;
  link: string;
  icon?: React.ReactNode;
}

export const LandingFooter = () => {
  const aboutUsLinks: FooterLinkProps[] = [
    {
      title: 'Nhiệm vụ',
      link: '#'
    },
    {
      title: 'Đội',
      link: '#'
    }
  ];

  const SupportLinks: FooterLinkProps[] = [
    {
      title: 'Liên hệ',
      link: '#contact'
    },
    {
      title: 'Chính sách hoàn trả',
      link: '#'
    },
    {
      title: 'FAQs',
      link: '#faqs'
    }
  ];

  const SocialLinks: FooterLinkProps[] = [
    {
      title: 'Instagram',
      link: '#',
      icon: <Instagram />
    },
    {
      title: 'Youtube',
      link: '#',
      icon: <Youtube />
    },
    {
      title: 'Facebook',
      link: '#',
      icon: <Facebook />
    }
  ];

  const handleLinkClick = React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, link: string) => {
      event.preventDefault();
      const targetElement = document.querySelector(link);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    },
    []
  );
  return (
    <Box bgcolor={'#636e7b'} paddingY={2} color={'white'} paddingX={5}>
      <Box display={'flex'} paddingBottom={2} justifyContent={'space-around'}>
        <Image src={logo} alt='logo' width={200} height={200} />
        <Stack spacing={2} width={'70%'}>
          <Typography variant='h4' marginBottom={5} color='#5be23d'>
            Transport Support Application (TSA)
          </Typography>
          <Grid container>
            <Grid item xs={4}>
              <Typography variant='h6' marginBottom={1}>
                Về chúng tôi
              </Typography>
              <Stack spacing={1}>
                {aboutUsLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.link}
                    underline='none'
                    color='inherit'
                    className='hover:text-blue-500'
                    onClick={(event) => handleLinkClick(event, link.link)}
                  >
                    <Typography variant='body1'>{link.title}</Typography>
                  </Link>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={4}>
              <Typography variant='h6' marginBottom={1}>
                Hỗ trợ
              </Typography>
              <Stack spacing={1}>
                {SupportLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.link}
                    underline='none'
                    color='inherit'
                    className='hover:text-blue-500'
                    onClick={(event) => handleLinkClick(event, link.link)}
                  >
                    <Typography variant='body1'>{link.title}</Typography>
                  </Link>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={4}>
              <Typography variant='h6' marginBottom={1}>
                Kênh liên lạc
              </Typography>
              <Stack spacing={1}>
                {SocialLinks.map((link, index) => (
                  <Box
                    display={'flex'}
                    gap={1}
                    key={index}
                    className='hover:text-blue-500 cursor-pointer'
                  >
                    {link.icon}
                    <Link href={link.link} underline='none' color='inherit'>
                      <Typography variant='body1'>{link.title}</Typography>
                    </Link>
                  </Box>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Box>
      <Divider />
      <Box display={'flex'} justifyContent={'space-between'} paddingTop={2}>
        <Typography>Copyright © 2024 TSA. All rights reserved.</Typography>
        <Typography>Terms of Service</Typography>
      </Box>
    </Box>
  );
};
