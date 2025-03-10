import { Avatar, Box, Divider, Stack, Typography } from '@mui/material';
import React, { useMemo } from 'react';
import { TicketDetailWithReplies } from 'src/types/ticket';
import { useAuth } from '@hooks';
import { useFirebaseAuth } from '@hooks';
import { Printer } from 'lucide-react';
import Image from 'next/image';

interface TicketDetailHistoryProps {
  ticket: TicketDetailWithReplies;
}

interface TicketHeaderItemProps {
  title: string;
  value: string;
}

const TicketDetailHistoryItem: React.FC<{
  createdAt: string;
  name: string;
  avatarUrl: string;
  isInitial: boolean;
  content: string;
  attachments: string[];
}> = ({ createdAt, name, avatarUrl, isInitial, content, attachments }) => {
  return (
    <Stack>
      <Box display={'flex'} alignItems={'center'} gap={1} mb={1}>
        <Typography variant='body2' color='textSecondary'>
          {createdAt}
        </Typography>
        <Typography textTransform={'uppercase'}>- {name}</Typography>
        <Typography>{isInitial ? 'Đã tạo' : 'Đã trả lời'}</Typography>
      </Box>
      <Box display={'flex'} gap={1}>
        <Avatar src={avatarUrl} />
        <Stack direction={'column'} gap={0.5}>
          <Typography variant='body2' color='primary'>
            {name}
          </Typography>
          <Typography variant='body2'>{content}</Typography>
          <Stack direction={'row'} gap={1}>
            {attachments.map((attachment, index) => (
              <Image key={index} src={attachment} width={50} height={50} alt='Attachment Image' />
            ))}
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
};

const TicketDetailHistory: React.FC<TicketDetailHistoryProps> = ({ ticket }) => {
  const { user } = useAuth();
  const { user: firebaseUser } = useFirebaseAuth();
  const ticketOwnerInfo: TicketHeaderItemProps[] = useMemo(() => {
    return [
      {
        title: 'Đã được tạo',
        value: ticket.createdAt
      },
      {
        title: 'Bởi',
        value:
          user?.lastName + ' ' + user?.firstName ||
          firebaseUser?.lastName + ' ' + firebaseUser?.firstName ||
          ''
      }
    ];
  }, [user, firebaseUser, ticket]);
  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      gap={2}
      paddingX={3}
      paddingY={2}
      border={'1px solid #cecece'}
    >
      <Box>
        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
          <Typography variant='h5' fontWeight={'regular'}>
            {ticket.title}
          </Typography>
          <Printer className='cursor-pointer' size={20} onClick={() => window.print()} />
        </Stack>
        <Stack direction={'row'} gap={2} mt={1}>
          {ticketOwnerInfo.map((item, index) => (
            <Box key={index} display={'flex'} alignItems={'center'} gap={0.5}>
              <Typography variant='body2' color='textSecondary'>
                {item.title}
              </Typography>
              <Typography>-</Typography>
              <Typography variant='body2'>{item.value}</Typography>
            </Box>
          ))}
        </Stack>
      </Box>
      <Divider />
      <TicketDetailHistoryItem
        createdAt={ticket.createdAt}
        name={ticket.studentId}
        avatarUrl={ticket.studentId}
        isInitial={true}
        content={ticket.content}
        attachments={ticket.ticketAttachments.map((attachment) => attachment.filePath)}
      />
      {ticket.replies.length > 0 && <Divider />}
      <Stack gap={2}>
        {ticket.replies.map((reply, index) => (
          <Box key={index}>
            <TicketDetailHistoryItem
              createdAt={reply.createdAt}
              name={reply.userId}
              avatarUrl={reply.userId}
              isInitial={index === 0}
              content={reply.content}
              attachments={reply.replyAttachments.map((attachment) => attachment.filePath)}
            />
            {index !== ticket.replies.length - 1 && <Divider />}
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default TicketDetailHistory;
