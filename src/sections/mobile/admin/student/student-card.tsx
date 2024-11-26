import { Card, Divider, Stack, Typography, Box, Chip, Avatar } from '@mui/material';
import React, { useCallback } from 'react';
import { useRouter } from 'next/router';
import { UserDetail } from 'src/types/user';
import { formatDate, formatUnixTimestamp, formatVNDcurrency } from 'src/utils/format-time-currency';

const MobileStudentCard: React.FC<{ student: UserDetail; number: number }> = ({
  student,
  number
}) => {
  const router = useRouter();
  const handleGoStudent = useCallback(() => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, studentId: student.id }
    });
  }, [router, student]);
  return (
    <Stack className='text-black cursor-pointer' width={'100%'} onClick={handleGoStudent}>
      <Stack direction={'row'} alignItems={'center'} justifyContent='space-between'>
        <Stack direction={'row'} alignItems={'center'} gap={2}>
          <Typography>{number}</Typography>
          <Avatar
            src={student.photoUrl as string}
            alt='student avatar'
            sx={{ width: 56, height: 56, borderRadius: 1 }}
          />
          <Stack gap={1}>
            <Typography variant='subtitle2'>
              {student.lastName} {student.firstName}
            </Typography>
            <Typography variant='subtitle2' color='gray'>
              {student.phoneNumber}
            </Typography>
            <Typography variant='subtitle2' color='error'>
              {formatDate(formatUnixTimestamp(student.createdAt))}
            </Typography>
          </Stack>
        </Stack>
        <Chip
          variant='filled'
          label={
            student.status === 'AVAILABLE'
              ? 'Online'
              : student.status === 'BUSY'
                ? 'Bận'
                : 'Offline'
          }
          color={
            student.status === 'AVAILABLE'
              ? 'success'
              : student.status === 'BUSY'
                ? 'error'
                : 'secondary'
          }
        />
      </Stack>
      <Divider className='py-2' />
    </Stack>
  );
};

export default MobileStudentCard;
