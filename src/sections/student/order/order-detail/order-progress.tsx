import React from 'react';
import { Card, Typography, Stack, Grid, Box, Button } from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from '@mui/lab';
import { Box1, Truck, Routing2, Star, Warning2 } from 'iconsax-react';

interface progressTimeProps {
  title: string;
  icon: React.ReactNode;
  time: string;
}

function OrderProgress() {
  const progressTimeList: progressTimeProps[] = [
    {
      title: 'Nhập kho',
      icon: <Truck size={24} />,
      time: '10:00 12/10/2021'
    },
    {
      title: 'Bắt đầu giao',
      icon: <Routing2 size={24} />,
      time: '12:00 12/10/2021'
    },
    {
      title: 'Hoàn tất',
      icon: <Box1 size={24} />,
      time: '14:00 12/10/2021'
    }
  ];

  return (
    <Stack spacing={2}>
      <Typography variant='h6'>Tiến độ đơn hàng</Typography>
      <Card className='px-3 py-2'>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Timeline position='left' className='items-start'>
              {progressTimeList.map((progressTime, index) => (
                <TimelineItem key={index}>
                  <TimelineContent className='flex items-center w-full whitespace-nowrap'>
                    <Typography variant='h6'>{progressTime.title}</Typography>
                  </TimelineContent>
                  <TimelineSeparator>
                    <TimelineDot color='success'>{progressTime.icon}</TimelineDot>
                    {index !== progressTimeList.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                </TimelineItem>
              ))}
            </Timeline>
          </Grid>
          <Grid item xs={4}>
            <Box className='flex flex-col justify-between h-full'>
              {progressTimeList.map((progressTime, index) => (
                <Box key={index} className='flex items-center h-full'>
                  <Typography variant='body2' color='error' fontWeight={'bold'}>
                    {progressTime.time}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
        <Stack direction='row' justifyContent={'space-between'}>
          <Button variant='contained' color='success' startIcon={<Star size={24} />}>
            Đánh giá
          </Button>
          <Button variant='contained' color='success' startIcon={<Warning2 size={24} />}>
            Theo dõi chi tiết
          </Button>
        </Stack>
      </Card>
    </Stack>
  );
}

export default OrderProgress;
