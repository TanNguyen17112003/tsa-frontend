import { Box, Typography } from '@mui/material';
import React from 'react';
import { TicketDetailWithReplies } from 'src/types/ticket';

interface TicketDetailHistoryProps {
  ticket: TicketDetailWithReplies;
}

const TicketDetailHistory: React.FC<TicketDetailHistoryProps> = ({ ticket }) => {
  return (
    <Box>
      <Typography>TicketDetailHistory</Typography>
    </Box>
  );
};

export default TicketDetailHistory;
