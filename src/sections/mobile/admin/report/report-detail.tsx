import { Card, Divider, Stack, Typography } from '@mui/material';
import { Box, Money, Bank } from 'iconsax-react';
import React from 'react';
import { OrderDetail } from 'src/types/order';
import { formatDate, formatUnixTimestamp, formatVNDcurrency } from 'src/utils/format-time-currency';

const ReportCard: React.FC<{ order: OrderDetail }> = ({ order }) => {
  return (
    <Card className='px-4 py-3 flex flex-col gap-1'>
      <Typography variant='subtitle1' fontWeight={'bold'} color='primary'>
        Mã đơn hàng: #{order.checkCode}
      </Typography>
      <Stack direction='row' alignItems='center' gap={1} mt={1}>
        <Box size={32} name='Calendar' variant='Bold' color='green' />
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
          width={'100%'}
        >
          <Stack gap={0.5}>
            <Typography variant='subtitle1'>
              {order.product.startsWith(', ') ? order.product.substring(2) : order.product}
            </Typography>
            <Typography variant='subtitle2' fontWeight={'normal'}>
              P.{order.room}, T.{order.building}, KTX khu {order.dormitory}
            </Typography>
            <Typography variant='subtitle2' fontWeight={'light'}>
              {order.weight} kg
            </Typography>
          </Stack>
          {order.paymentMethod === 'CASH' ? (
            <Money size={20} />
          ) : order.paymentMethod === 'CREDIT' ? (
            <Bank size={20} />
          ) : (
            <Typography>MOMO</Typography>
          )}
        </Stack>
      </Stack>
      <Divider className='py-2' />
      <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
        <Typography variant='subtitle2'>{formatVNDcurrency(order.shippingFee)}</Typography>
        <Typography variant='subtitle2'>
          {!order.isPaid ? 'Chưa thanh toán' : 'Đã thanh toán'}
        </Typography>
        <Typography variant='subtitle2' color='error'>
          {formatDate(formatUnixTimestamp(order.deliveryDate))}
        </Typography>
      </Stack>
    </Card>
  );
};

export default ReportCard;
