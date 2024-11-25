import { Card, Divider, Stack, Typography, Box, Chip } from '@mui/material';
import { Money, Bank } from 'iconsax-react';
import React from 'react';
import { ReportDetail } from 'src/types/report';
import Image from 'next/image';
import { formatDate, formatUnixTimestamp, formatVNDcurrency } from 'src/utils/format-time-currency';

const ReportCard: React.FC<{ report: ReportDetail; number: number }> = ({ report }) => {
  return (
    <Stack className='text-black' width={'100%'}>
      <Stack direction={'row'} alignItems={'center'} justifyContent='space-between'>
        <Stack direction={'row'} alignItems={'center'} gap={1}>
          {(report.proof as string).endsWith('.jpg') ||
          (report.proof as string).endsWith('.png') ? (
            <Box className='cursor-pointer w-[100px]'>
              <img src={report.proof as string} alt='proof' width={'100%'} />
            </Box>
          ) : (
            <Box className='w-[100px]'>
              <Typography textAlign={'center'}>{report.proof as string}</Typography>
            </Box>
          )}
          <Stack gap={2}>
            <Stack>
              <Typography variant='subtitle2'>Đơn hàng: #{report.orderId?.slice(0, 4)}</Typography>
              <Typography variant='subtitle2'>
                Khiếu nại: {formatDate(formatUnixTimestamp(report.reportedAt as string))}
              </Typography>
              <Typography variant='subtitle2'>Nội dung: {report.content}</Typography>
              <Typography variant='subtitle2'>Phản hồi: {report.reply}</Typography>
            </Stack>
          </Stack>
        </Stack>
        <Chip
          variant='filled'
          label={report.status === 'PENDING' ? 'Đang xử lý' : 'Đã xử lý'}
          color={report.status === 'PENDING' ? 'warning' : 'success'}
        />
      </Stack>
      <Divider className='py-2' />
    </Stack>
  );
};

export default ReportCard;
