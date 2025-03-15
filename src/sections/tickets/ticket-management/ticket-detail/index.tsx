import { Box, Typography, Stack } from '@mui/material';
import React, { useMemo } from 'react';
import TicketDetailHistory from './ticket-detail-history';
import TicketDetailInfo from './ticket-detail-info';
import { useResponsive } from 'src/utils/use-responsive';
import { useRouter } from 'next/router';
import { useTicketsContext } from 'src/contexts/tickets/tickets-context';
import { TicketDetail as DetailType } from 'src/types/ticket';

function TicketDetail() {
  const { isMobile, isDesktop, isTablet } = useResponsive();
  const router = useRouter();
  const { getTicketsApi, getTicketCategoriesApi } = useTicketsContext();
  const ticket = useMemo(() => {
    return (getTicketsApi.data || []).find((ticket) => ticket.id === router.query.ticketId);
  }, [getTicketsApi.data, router.query.ticketId]);

  const type = useMemo(() => {
    return (getTicketCategoriesApi.data || []).find(
      (category) => category.id === ticket?.categoryId
    )?.name;
  }, [getTicketCategoriesApi.data]);
  // const ticket = useMemo(() => {
  //   const foundTicket = mockTickets.find((ticket) => ticket.id === router.query.ticketId);
  //   const foundReplies = mockReplies.filter((reply) => reply.ticketId === router.query.ticketId);
  //   const foundAttachmentsByTicket = mockAttachments.filter(
  //     (attachment) => attachment.ticketId === router.query.ticketId
  //   );
  //   const foundAttachmentsByReplies = mockAttachments.filter((attachment) =>
  //     foundReplies.map((reply) => reply.id).includes(attachment.replyId as string)
  //   );
  //   // Now I want to return the ticket with its replies and in each reply I want to include its attachments
  //   const results = {
  //     ...foundTicket,
  //     ticketAttachments: foundAttachmentsByTicket,
  //     replies: foundReplies.map((reply) => ({
  //       ...reply,
  //       replyAttachments: foundAttachmentsByReplies.filter(
  //         (attachment) => attachment.replyId === reply.id
  //       )
  //     }))
  //   };
  //   return results;
  // }, [mockTickets, mockReplies, mockAttachments]);
  return (
    <Box
      display={'flex'}
      flexDirection={isMobile ? 'column' : 'row'}
      gap={2}
      className='text-black'
    >
      <Stack flex={0.3}>
        <TicketDetailInfo ticket={ticket as DetailType} type={type as string} />
      </Stack>
      <Stack flex={0.7}>
        <TicketDetailHistory ticket={ticket as DetailType} />
      </Stack>
    </Box>
  );
}

export default TicketDetail;
