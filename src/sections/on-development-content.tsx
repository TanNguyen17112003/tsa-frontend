import { Button, Typography, useMediaQuery } from '@mui/material';
import { Box, Container, Theme } from '@mui/system';
import { Seo } from 'src/components/seo';
import HomeIcon from '@mui/icons-material/Home';
import DevelopingImage from '../../public/ui/error-404.png';
import Image from 'next/image';

export default function OnDevelopmentContent() {
  const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  return (
    <>
      <Seo title='Lỗi: Tính năng đang được phát triển' />
      <Box component='main' display={'flex'} flexGrow={1} py={20}>
        <Container maxWidth='lg'>
          <Box display={'flex'} justifyContent={'center'} mb={6}>
            <Image
              alt='Not found'
              src={DevelopingImage}
              height={200}
              width={200}
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </Box>
          <Typography align='center' variant={mdUp ? 'h1' : 'h5'} color='black'>
            Tính năng đang trong quá trình phát triển
          </Typography>
          <Typography align='center' variant={'body1'} color={'text.secondary'} mt={1.5}>
            Chúng tôi đang nỗ lực để mang đến cho bạn những trải nghiệm tốt hơn. Hãy kiên nhẫn chờ
            đợi và theo dõi phiên bản cập nhật sắp tới của chúng tôi 🚀
          </Typography>
          <Box
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            mt={3}
            color={'text.secondary'}
          >
            <Button
              color='primary'
              variant='contained'
              onClick={() => {}}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1
              }}
            >
              <HomeIcon />
              <Typography variant='body1' color='inherit'>
                Trở về màn hình chính
              </Typography>
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
}
