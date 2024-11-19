import React, { useMemo } from 'react';
import { Card, Typography, Stack, Grid, Box, Button } from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from '@mui/lab';
import { OrderDetail } from 'src/types/order';
import { orderStatusIconList } from 'src/types/order';
import { formatDate, formatUnixTimestamp } from 'src/utils/format-time-currency';

interface progressTimeProps {
  title: string;
  icon: React.ReactNode;
  time: string;
  color: string;
}

interface OrderProgressProps {
  order: OrderDetail;
}

const OrderProgress: React.FC<OrderProgressProps> = ({ order }) => {
  const progressTimeList: progressTimeProps[] = useMemo(() => {
    const progressTimeList: progressTimeProps[] = [];
    order.historyTime?.forEach((historyTime) => {
      const status = orderStatusIconList.find((status) => status.status === historyTime.status);
      if (status) {
        progressTimeList.push({
          title: status.title,
          icon: status.icon,
          time: historyTime.time,
          color: status.color
        });
      }
    });
    return progressTimeList;
  }, [order.historyTime, orderStatusIconList]);

  return (
    <Stack spacing={2}>
      <Typography variant='h5' color='primary'>
        Tiến độ đơn hàng
      </Typography>
      <Card className='px-3 py-2'>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Timeline position='left' className='items-start'>
              {progressTimeList.map((progressTime, index) => (
                <TimelineItem key={index} className='flex items-center'>
                  <TimelineContent className='flex items-center w-full whitespace-nowrap'>
                    <Typography variant='h6'>{progressTime.title}</Typography>
                  </TimelineContent>
                  <TimelineSeparator>
                    <TimelineDot sx={{ bgcolor: progressTime.color }}>
                      {progressTime.icon}
                    </TimelineDot>
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
                    {formatDate(formatUnixTimestamp(progressTime.time))}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Card>
    </Stack>
  );
};

export default OrderProgress;
