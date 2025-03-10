import { Box, Divider, Stack, Typography } from '@mui/material';
import React, { useMemo } from 'react';
import { TicketDetailWithReplies, ticketTypeMap } from 'src/types/ticket';
import { Reply, AlarmClock } from 'lucide-react';

interface TicketDetailInfoProps {
  ticket: TicketDetailWithReplies;
}

interface TicketDetailInfoItem {
  title: string;
  icon?: React.ReactNode;
  value: string | number;
}

const TicketDetailInfo: React.FC<TicketDetailInfoProps> = ({ ticket }) => {
  const infoItems: TicketDetailInfoItem[] = useMemo(() => {
    return [
      {
        title: 'Tổng số trả lời',
        value: ticket.replies.length,
        icon: <Reply size={20} />
      },
      {
        title: 'Thời gian',
        value: ticket.createdAt,
        icon: <AlarmClock size={20} />
      },
      {
        title: 'Tình trạng',
        value:
          ticket.status === 'open'
            ? 'Đang mở'
            : ticket.status === 'in-progress'
              ? 'Đang trao đổi'
              : 'Đã hoàn thành'
      },
      {
        title: 'Loại',
        value:
          Object.keys(ticketTypeMap).find(
            (key) => ticketTypeMap[key as keyof typeof ticketTypeMap] === ticket.type
          ) || ''
      }
    ];
  }, [ticket]);
  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      gap={2}
      paddingX={3}
      paddingY={2}
      border={'1px solid #cecece'}
    >
      <Typography variant='h6' color='secondary'>
        TICKET INFORMATION
      </Typography>
      {infoItems.slice(0, 2).map((item, index) => (
        <Stack key={index} spacing={0.5}>
          <Typography fontWeight={'bold'}>{item.title}</Typography>
          <Box display={'flex'} alignItems={'center'} gap={1}>
            {item.icon}
            <Typography>{item.value}</Typography>
          </Box>
        </Stack>
      ))}
      <Divider />
      {infoItems.slice(2).map((item, index) => (
        <Stack key={index} spacing={0.5}>
          <Typography fontWeight={'bold'}>{item.title}</Typography>
          <Box display={'flex'} alignItems={'center'} gap={1}>
            {item.icon}
            <Typography>{item.value}</Typography>
          </Box>
        </Stack>
      ))}
    </Box>
  );
};

export default TicketDetailInfo;
