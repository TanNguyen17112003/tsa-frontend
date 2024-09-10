import React from 'react';
import { Box, Stack, Typography, Button } from '@mui/material';
import Image from 'next/image';
import Typical from 'react-typical';
import deliveryMan from '../../../public/ui/delivery-man.png';
import material from '../../../public/ui/material.png';
import tree from '../../../public/ui/tree.png';
import OnDevelopmentContent from '../on-development-content';

export const LandingAboutUs = () => {
  return (
    <Box
      display={'flex'}
      justifyContent={'center'}
      sx={{ bgcolor: '#ffffff', position: 'relative', height: '100vh' }}
      paddingY={10}
      className='fade-in'
    >
      <Image
        src={material}
        width={150}
        alt='material'
        className='fade-in'
        style={{ position: 'absolute', top: 0, left: 0 }}
      />
      <Box width={'60%'} display={'flex'} justifyContent={'center'} alignItems={'center'} gap={5}>
        <Stack width={'50%'}>
          <Box width={'450px'} height={'450px'} borderRadius={'100%'} bgcolor={'#5BE23D'}>
            <Image src={deliveryMan} alt='delivery' className='fade-in' />
          </Box>
        </Stack>
        <Stack width={'50%'} spacing={2}>
          <Typography variant='h4' color='black'>
            <Typical steps={['Về chúng tôi', 1000]} loop={1} wrapper='span' />
          </Typography>
          <Typography variant='body2' color='black' fontWeight={'light'}>
            <Typical
              steps={[
                'Chúng tôi tự hào với đội ngũ nhân viên tận tâm và chuyên nghiệp, luôn sẵn sàng hỗ trợ bạn từ bước đầu tiên cho đến khi mọi thứ được chuyển đến đúng nơi.',
                1000
              ]}
              loop={1}
              wrapper='span'
            />
          </Typography>
          <Typography variant='body2' color='black' fontWeight={'light'}>
            <Typical
              steps={[
                'Dịch vụ của chúng tôi không chỉ giúp bạn tiết kiệm thời gian và công sức, mà còn giúp bạn yên tâm hơn với sự đảm bảo về chất lượng và sự an toàn của hàng hóa.',
                1000
              ]}
              loop={1}
              wrapper='span'
            />
          </Typography>
          <Button variant='contained' color='success' sx={{ alignSelf: 'flex-start' }}>
            Xem thêm
          </Button>
        </Stack>
      </Box>
      <Image
        src={tree}
        width={200}
        alt='tree'
        className='fade-in'
        style={{ position: 'absolute', bottom: 0, right: 0 }}
      />
    </Box>
  );
};
