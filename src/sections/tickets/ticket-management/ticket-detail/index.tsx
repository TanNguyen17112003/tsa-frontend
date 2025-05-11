import { Box, Typography, Stack, CircularProgress } from '@mui/material';
import React, { useMemo } from 'react';
import TicketDetailHistory from './ticket-detail-history';
import TicketDetailInfo from './ticket-detail-info';
import { useResponsive } from 'src/utils/use-responsive';
import { useRouter } from 'next/router';
import { useTicketsContext } from 'src/contexts/tickets/tickets-context';
import { TicketDetail as DetailType } from 'src/types/ticket';
import LoadingProcess from 'src/components/LoadingProcess';

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
      {(getTicketCategoriesApi.loading || getTicketsApi.loading) && <LoadingProcess />}
    </Box>
  );
}

export default TicketDetail;
