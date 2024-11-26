import { Box, Typography, Stack, Card, Button } from '@mui/material';
import React, { useCallback, useMemo } from 'react';
import { OrderDetail } from 'src/types/order';
import { ArrowLeft, DocumentText, ArrowSwapHorizontal } from 'iconsax-react';
import { useRouter } from 'next/router';
import { paths } from 'src/paths';
import useStaffData from 'src/hooks/use-staff-data';
import { formatDate, formatUnixTimestamp, formatVNDcurrency } from 'src/utils/format-time-currency';

const MobileOrderDetail: React.FC<{ order: OrderDetail }> = ({ order }) => {
  const { users } = useStaffData();
  const studentName = useMemo(() => {
    const foundStudent = users.find((user) => user.id === order?.studentId);
    return `${foundStudent?.lastName} ${foundStudent?.firstName}`;
  }, [users, order]);
  const staffName = useMemo(() => {
    const foundStaff = users.find((user) => user.id === order?.shipperId);
    return `${foundStaff?.lastName} ${foundStaff?.firstName}`;
  }, [users, order]);
  const router = useRouter();
  const handleGoOrderList = useCallback(() => {
    router.push(paths.dashboard.order.index);
  }, [router]);

  const orderInfoList = useMemo(
    () => [
      {
        label: 'Mã đơn hàng',
        value: order?.checkCode
      },
      {
        label: 'Sản phẩm',
        value: order?.product.startsWith(', ') ? order?.product.substring(2) : order?.product
      },
      {
        label: 'Địa chỉ',
        value: `P.${order?.room}, T.${order?.building}, KTX khu ${order?.dormitory}`
      },
      {
        label: 'Thời gian',
        value: formatDate(formatUnixTimestamp(order?.deliveryDate))
      },
      {
        label: 'Đơn giá',
        value: formatVNDcurrency(order?.shippingFee)
      },
      {
        label: 'Phương thức thanh toán',
        value:
          order?.paymentMethod === 'CASH'
            ? 'Tiền mặt'
            : order?.paymentMethod === 'CREDIT'
              ? 'Chuyển khoản'
              : 'Momo'
      },
      {
        label: 'Trạng thái',
        value:
          order?.latestStatus === 'DELIVERED'
            ? 'Đã giao'
            : order?.latestStatus === 'CANCELLED'
              ? 'Đã hủy'
              : order?.latestStatus === 'PENDING'
                ? 'Đang chờ xử lý'
                : order?.latestStatus === 'ACCEPTED'
                  ? 'Đã xác nhận'
                  : order?.latestStatus === 'IN_TRANSPORT'
                    ? 'Đang vận chuyển'
                    : 'Đã từ chối'
      },
      {
        label: 'Người nhận',
        value: studentName ? studentName : 'Chưa cập nhật'
      },
      {
        label: 'Nhân viên giao hàng',
        value: order?.shipperId && staffName ? staffName : 'Chưa cập nhật'
      }
    ],
    [studentName, staffName, order]
  );

  return (
    <Box className='bg-white text-black px-4 py-3 min-h-screen'>
      <Stack
        direction={'row'}
        alignItems={'center'}
        gap={1}
        onClick={handleGoOrderList}
        mb={2}
        className='cursor-pointer'
      >
        <ArrowLeft />
        <Typography>Quay lại</Typography>
      </Stack>
      <Card className='px-6 py-5'>
        <Typography textAlign={'center'} fontWeight={'bold'} color='primary' variant='h5'>
          Thông tin chung
        </Typography>
        <Stack className='mt-5 gap-5'>
          {orderInfoList.map((info, index) => (
            <Stack key={index} direction={'row'} justifyContent={'space-between'}>
              <Typography variant='subtitle2' fontWeight={'light'}>
                {info.label}
              </Typography>
              <Typography variant='subtitle2' fontWeight={'bold'}>
                {info.value}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Card>
    </Box>
  );
};

export default MobileOrderDetail;
