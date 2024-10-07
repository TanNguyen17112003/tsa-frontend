import React from 'react';
import { Typography, Card, Stack, Box } from '@mui/material';
import { TrendingDown, TrendingUp } from 'lucide-react';

export interface AnaLysticCardProps {
  title: string;
  value: string | number;
  changeValue: number;
  type: 'WEEK' | 'MONTH';
  icon: React.ReactNode;
  iconColor: string;
  backgroundColor: string;
  onClick?: () => void;
}

const AnaLysticCard: React.FC<AnaLysticCardProps> = (props) => {
  return (
    <Card className='px-4 py-3 w-full cursor-pointer' onClick={props.onClick}>
      <Stack direction='row' justifyContent='space-between' alignItems={'center'} marginBottom={5}>
        <Stack spacing={1}>
          <Typography variant='subtitle1'>{props.title}</Typography>
          <Typography variant='h5'>{props.value}</Typography>
        </Stack>
        <Box
          className='flex justify-center items-center rounded-lg w-10 h-10'
          style={{ backgroundColor: props.backgroundColor }}
        >
          <Box style={{ color: props.iconColor }}>{props.icon}</Box>
        </Box>
      </Stack>
      <Stack direction={'row'} gap={0.5} alignItems={'center'}>
        {props.changeValue > 0 ? (
          <TrendingUp size={16} color='#20BFA7' />
        ) : (
          <TrendingDown size={16} color='red' />
        )}
        <Typography color={props.changeValue > 0 ? '#20BFA7' : 'red'} variant='subtitle2'>
          {props.changeValue}%
        </Typography>
        <Typography variant='subtitle2'>
          so với {props.type === 'WEEK' ? 'tuần' : 'tháng'} trước
        </Typography>
      </Stack>
    </Card>
  );
};

export default AnaLysticCard;
