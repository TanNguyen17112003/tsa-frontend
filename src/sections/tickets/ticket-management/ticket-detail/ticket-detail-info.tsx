import { Box, Divider, Stack, Typography } from '@mui/material';
import React, { useMemo } from 'react';
import { TicketDetail, ticketTypeMap } from 'src/types/ticket';
import { Reply, AlarmClock } from 'lucide-react';
import { formatDate } from 'src/utils/format-time-currency';

interface TicketDetailInfoProps {
  ticket: TicketDetail;
  type: string;
}

interface TicketDetailInfoItem {
  title: string;
  icon?: React.ReactNode;
  value: string | number;
}

const TicketDetailInfo: React.FC<TicketDetailInfoProps> = ({ ticket, type }) => {
  const infoItems: TicketDetailInfoItem[] = useMemo(() => {
    return [
      {
        title: 'Tổng số trả lời',
        value: ticket?.replies.length,
        icon: <Reply size={20} />
      },
      {
        title: 'Thời gian',
        value: formatDate(ticket?.createdAt as Date),
        icon: <AlarmClock size={20} />
      },
      {
        title: 'Tình trạng',
        value:
          ticket?.status === 'PENDING'
            ? 'Đang mở'
            : ticket?.status === 'PROCESSING'
              ? 'Đang trao đổi'
              : ticket?.status === 'REPLIED'
                ? 'Đã trả lời'
                : 'Đã hoàn thành'
      },
      {
        title: 'Loại',
        value: type
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
