import { Box, Typography } from '@mui/material';
import React from 'react';
import { TicketDetailWithReplies } from 'src/types/ticket';

interface TicketDetailInfoProps {
  ticket: TicketDetailWithReplies;
}

const TicketDetailInfo: React.FC<TicketDetailInfoProps> = ({ ticket }) => {
  return (
    <Box>
      <Typography>TicketDetailInfo</Typography>
    </Box>
  );
};

export default TicketDetailInfo;
