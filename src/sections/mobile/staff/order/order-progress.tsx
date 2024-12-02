import React, { useMemo } from 'react';
import { Box, Stack, Typography } from '@mui/material';
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
    order?.historyTime?.forEach((historyTime) => {
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
  }, [order?.historyTime]);

  return (
    <Stack gap={3} mt={2}>
      {progressTimeList.map((progressTime, index) => (
        <Stack key={index} direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
          <Stack direction={'row'} alignItems={'center'} gap={1}>
            <Typography color={progressTime.color} fontWeight={'bold'} variant='subtitle2'>
              {progressTime.title}
            </Typography>
            <Box color={progressTime.color}>{progressTime.icon}</Box>
          </Stack>
          <Typography variant='subtitle2'>
            {formatDate(formatUnixTimestamp(progressTime.time))}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
};

export default OrderProgress;
