import { Box, Paper, Stack, Typography } from '@mui/material';
import React from 'react';

function ContentHeader({
  title,
  description,
  rightSection,
  tabs
}: {
  title: string;
  description?: string;
  rightSection?: React.ReactNode;
  tabs?: React.ReactNode;
}) {
  return (
    <Paper
      elevation={5}
      sx={{
        paddingTop: '24px',
        paddingLeft: '24px',
        paddingRight: '24px',
        borderRadius: 0
      }}
    >
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 2,
          flexWrap: 'wrap'
        }}
      >
        <Stack display={'flex'} flexDirection={'column'} spacing={1} flex={1}>
          <Typography variant='h4'>{title}</Typography>
          {description && (
            <Typography variant='body2' fontWeight={'bold'}>
              {description}
            </Typography>
          )}
          {tabs}
        </Stack>
        <div>{rightSection}</div>
      </Box>
    </Paper>
  );
}

export default ContentHeader;
