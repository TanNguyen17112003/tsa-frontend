import { Box, Typography } from '@mui/material';
import React from 'react';

export const LandingFooter = () => {
  return (
    <Box bgcolor={'black'} paddingY={2}>
      <Typography variant={'h6'} textAlign={'center'} color='white'>
        Copyright © 2024 TSA. All rights reserved.
      </Typography>
    </Box>
  );
};
