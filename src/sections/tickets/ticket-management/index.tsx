import React from 'react';
import { useRouter } from 'next/router';
import TicketDetail from './ticket-detail';
import { Box } from '@mui/material';

function TicketManagement() {
  const router = useRouter();
  return router.query.questionId ? <TicketDetail /> : <Box>Chovy</Box>;
}

export default TicketManagement;
