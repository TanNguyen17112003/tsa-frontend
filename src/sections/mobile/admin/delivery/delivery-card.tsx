import { Card, Chip, Divider, Stack, Typography } from '@mui/material';
import React, { useMemo } from 'react';
import { formatDate, formatUnixTimestamp } from 'src/utils/format-time-currency';
import { DeliveryDetail } from 'src/types/delivery';
import { PiMotorcycle } from 'react-icons/pi';
import useStaffData from 'src/hooks/use-staff-data';
import { useAuth, useFirebaseAuth } from '@hooks';

const DeliveryCard: React.FC<{ delivery: DeliveryDetail }> = ({ delivery }) => {
  const { users } = useStaffData();
  const { user } = useAuth();
  const { user: firebaseUser } = useFirebaseAuth();

  const staffName = useMemo(() => {
    if (user?.role === 'ADMIN' || firebaseUser?.role === 'ADMIN') {
      const foundStaff = users.find((user) => user.id === delivery?.staffId);
      return `${foundStaff?.lastName} ${foundStaff?.firstName}`;
    }
    return null;
  }, [delivery, users, user, firebaseUser]);

  return (
    <Card className='px-4 py-3 flex flex-col gap-1 cursor-pointer'>
      <Typography variant='subtitle1' fontWeight={'bold'} color='primary'>
        Mã chuyến đi: {delivery.displayId}
      </Typography>

      <Stack direction='row' alignItems='center' gap={1} mt={1} justifyContent={'space-between'}>
        <Stack direction={'row'} alignItems={'center'} width={'100%'} gap={1.5}>
          <PiMotorcycle size={32} fontVariant={'Bold'} color='orange' />
          <Stack gap={0.5}>
            <Typography variant='body1'>Số lượng đơn hàng: {delivery.orders.length}</Typography>
            <Typography variant='subtitle2' color='grey'>
              Thời gian giới hạn: {delivery.limitTime}
            </Typography>
            {staffName && (
              <Typography variant='subtitle2' color='grey'>
                Nhân viên: {staffName}
              </Typography>
            )}
          </Stack>
        </Stack>
        <Chip
          label={
            delivery.DeliveryStatusHistory[0].status === 'PENDING'
              ? 'Đang chờ xử lý'
              : delivery.DeliveryStatusHistory[0].status === 'ACCEPTED'
                ? 'Đã xác nhận'
                : delivery.DeliveryStatusHistory[0].status === 'CANCELED'
                  ? 'Đã hủy'
                  : 'Đã hoàn thành'
          }
          color={
            delivery.DeliveryStatusHistory[0].status === 'PENDING'
              ? 'warning'
              : delivery.DeliveryStatusHistory[0].status === 'ACCEPTED'
                ? 'primary'
                : delivery.DeliveryStatusHistory[0].status === 'CANCELED'
                  ? 'error'
                  : 'success'
          }
        />
      </Stack>
      <Divider className='py-2' />
      <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
        <Typography variant='subtitle2' color='error'>
          {formatDate(formatUnixTimestamp(delivery.createdAt))}
        </Typography>
      </Stack>
    </Card>
  );
};

export default DeliveryCard;
