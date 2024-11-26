import { Card, Divider, Stack, Typography, Box, Chip, Avatar } from '@mui/material';
import React, { useCallback } from 'react';
import { useRouter } from 'next/router';
import { UserDetail } from 'src/types/user';
import { formatDate, formatUnixTimestamp, formatVNDcurrency } from 'src/utils/format-time-currency';

const MobileStaffCard: React.FC<{ staff: UserDetail; number: number }> = ({ staff, number }) => {
  const router = useRouter();
  const handleGoStaff = useCallback(() => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, staffId: staff.id }
    });
  }, [router, staff]);
  return (
    <Stack className='text-black cursor-pointer' width={'100%'} onClick={handleGoStaff}>
      <Stack direction={'row'} alignItems={'center'} justifyContent='space-between'>
        <Stack direction={'row'} alignItems={'center'} gap={2}>
          <Typography>{number}</Typography>
          <Avatar
            src={staff.photoUrl as string}
            alt='staff avatar'
            sx={{ width: 56, height: 56, borderRadius: 1 }}
          />
          <Stack gap={1}>
            <Typography variant='subtitle2'>
              {staff.lastName} {staff.firstName}
            </Typography>
            <Typography variant='subtitle2' color='gray'>
              {staff.phoneNumber}
            </Typography>
            <Typography variant='subtitle2' color='error'>
              {formatDate(formatUnixTimestamp(staff.createdAt))}
            </Typography>
          </Stack>
        </Stack>
        <Chip
          variant='filled'
          label={
            staff.status === 'AVAILABLE' ? 'Online' : staff.status === 'BUSY' ? 'Bận' : 'Offline'
          }
          color={
            staff.status === 'AVAILABLE'
              ? 'success'
              : staff.status === 'BUSY'
                ? 'error'
                : 'secondary'
          }
        />
      </Stack>
      <Divider className='py-2' />
    </Stack>
  );
};

export default MobileStaffCard;
