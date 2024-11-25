import React from 'react';
import { Box, Stack, Typography } from '@mui/material';

interface MobileContentHeaderProps {
  title: string;
  image: React.ReactNode;
  rigthComponent?: React.ReactNode;
}

const MobileContentHeader: React.FC<MobileContentHeaderProps> = (props) => {
  return (
    <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
      <Stack direction={'row'} alignItems={'center'} gap={1}>
        <Box>{props.image}</Box>
        <Typography color='black' fontWeight={'bold'}>
          {props.title}
        </Typography>
      </Stack>
      {props.rigthComponent}
    </Stack>
  );
};

export default MobileContentHeader;
