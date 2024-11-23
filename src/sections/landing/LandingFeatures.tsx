import { Box, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent
} from '@mui/lab';
import Image from 'next/image';
import deliveryMan2 from '../../../public/ui/delivery-man-2.png';
import React, { useState, useEffect } from 'react';

interface FeatureProps {
  title: string;
  description: string;
}

export const LandingFeatures = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const featureList: FeatureProps[] = [
    {
      title: 'Tiết kiệm thời gian nhận hàng',
      description:
        'Sinh viên không cần tốn thời gian đi đến tận nơi shipper giao hàng. Chỉ cần một cú “clck” sẽ giải quyết tất cả'
    },
    {
      title: 'Giá cả phải chăng',
      description:
        'Mỗi chuyến đơn hàng tùy thuộc vào khoảng cách chỉ có giá tiền giao động từ 5.000 - 10.000 VNĐ'
    },
    {
      title: 'Tích hợp nhiều ưu đãi',
      description:
        'Hệ thống thường xuyên gửi tặng các ưu đãi đạc biệt cho người dùng thường xuyên sử dụng hệ thống.'
    }
  ];

  const [visibleFeatures, setVisibleFeatures] = useState<number>(0);

  useEffect(() => {
    featureList.forEach((_, index) => {
      setTimeout(() => {
        setVisibleFeatures((prev) => prev + 1);
      }, index * 1000);
    });
  }, [featureList.length]);

  return (
    <Box
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
      gap={5}
      paddingY={5}
      sx={{
        background: 'linear-gradient(to left, #ffffff 30%, #9FD596 70%)',
        height: '100vh'
      }}
    >
      <Box width={isTablet ? '100%' : '40%'} color={'black'}>
        <Typography variant='h4' marginBottom={3} textAlign={isTablet ? 'center' : 'left'}>
          Sự lựa chọn hoàn hảo cho sinh viên
        </Typography>
        <Timeline position='alternate-reverse'>
          {featureList.map((feature, index) => (
            <TimelineItem key={index}>
              <TimelineSeparator>
                <TimelineDot color='error' />
                {index < featureList.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <Stack
                  spacing={1}
                  sx={{ opacity: visibleFeatures > index ? 1 : 0, transition: 'opacity 0.5s' }}
                >
                  <Typography variant='h6'>{feature.title}</Typography>
                  <Typography variant='body2'>{feature.description}</Typography>
                </Stack>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Box>
      {!isTablet && (
        <Box>
          <Image src={deliveryMan2} alt='delivery2' width={400} />
        </Box>
      )}
    </Box>
  );
};
