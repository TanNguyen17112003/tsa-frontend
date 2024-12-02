import React, { useCallback, useState, useMemo, useEffect } from 'react';
import OrderFilter from './order-filter';
import { Box, CircularProgress } from '@mui/material';
import { OrderDetail } from 'src/types/order';
import getOrderTableConfigs from './order-table-config';
import { CustomTable } from '@components';
import usePagination from 'src/hooks/use-pagination';
import { useRouter } from 'next/router';
import { useOrdersContext } from 'src/contexts/orders/orders-context';
import { formatUnixTimestamp, unixTimestampToDate } from 'src/utils/format-time-currency';
import { PaymentsApi } from 'src/api/payment';

interface OrderNotPaidProps {
  orders: OrderDetail[];
  loading: boolean;
}

const OrderNotPaid: React.FC<OrderNotPaidProps> = ({ orders, loading }) => {
  const router = useRouter();
  const orderStatusList = [
    'Tất cả',
    'Đã giao',
    'Đã hủy',
    'Đang giao',
    'Đã xác nhận',
    'Đang chờ xử lý',
    'Đã từ chối'
  ];

  const { deleteOrder, updateOrder } = useOrdersContext();

  const [selectedStatus, setSelectedStatus] = useState<string>('Tất cả');
  const [dateRange, setDateRange] = React.useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null
  });
  const [searchInput, setSearchInput] = useState<string>('');

  useEffect(() => {
    const queryStatus = router.query.status as string;
    const queryDateRange = router.query.dateRange as string;

    if (queryStatus) {
      setSelectedStatus(queryStatus);
    }

    if (queryDateRange) {
      const [startDate, endDate] = queryDateRange.split(',').map((date) => new Date(date));
      setDateRange({ startDate, endDate });
    }
  }, [router.query.status, router.query.dateRange]);

  const handleGoReport = useCallback(
    (data: OrderDetail) => {
      router.replace({
        pathname: router.pathname,
        query: { ...router.query, orderId: data.id }
      });
    },
    [router]
  );

  const handlePayment = useCallback(
    async (order: OrderDetail) => {
      try {
        if (order.paymentMethod === 'MOMO') {
          const paymentResponse = await PaymentsApi.postMomoPayment({
            orderId: order.id,
            amount: order.shippingFee?.toString() || '1000',
            orderInfo: 'Thanh toán đơn hàng ' + order.checkCode + ' qua MOMO',
            returnUrl: `${window.location.origin}/student/order`,
            notifyUrl: `${window.location.origin}/api/payment/momo/notify`,
            extraData: order.id
          });
          if (paymentResponse && paymentResponse.payUrl) {
            window.location.href = paymentResponse.payUrl;
          }
          updateOrder(
            {
              deliveryDate: unixTimestampToDate(order.deliveryDate).toString(),
              isPaid: true
            },
            order.id
          );
        } else if (order.paymentMethod === 'CREDIT') {
          const paymentResponse = await PaymentsApi.postPayOSPayment({
            orderId: order.id,
            amount: order.shippingFee || 2000,
            description: 'Thanh toán đơn hàng',
            returnUrl: `${window.location.origin}/student/order`,
            cancelUrl: `${window.location.origin}/student/order`,
            extraData: order.id
          });
          if (paymentResponse && paymentResponse.checkoutUrl) {
            window.location.href = paymentResponse.checkoutUrl;
          }
          updateOrder(
            {
              deliveryDate: unixTimestampToDate(order.deliveryDate).toString(),
              isPaid: true
            },
            order.id
          );
        }
      } catch (error) {
        console.error('Payment error:', error);
      }
    },
    [updateOrder]
  );

  const orderTableConfig = useMemo(() => {
    return getOrderTableConfigs({});
  }, [handlePayment]);

  const result = useMemo(() => {
    return orders.filter((order) => {
      const filterStatus =
        selectedStatus === 'Tất cả'
          ? true
          : selectedStatus === 'Đã giao'
            ? order.latestStatus === 'DELIVERED'
            : selectedStatus === 'Đã hủy'
              ? order.latestStatus === 'CANCELLED'
              : selectedStatus === 'Đang giao'
                ? order.latestStatus === 'IN_TRANSPORT'
                : selectedStatus === 'Đã xác nhận'
                  ? order.latestStatus === 'ACCEPTED'
                  : selectedStatus === 'Đang chờ xử lý'
                    ? order.latestStatus === 'PENDING'
                    : selectedStatus === 'Đã từ chối'
                      ? order.latestStatus === 'REJECTED'
                      : false;
      const orderDate = formatUnixTimestamp(order.deliveryDate);
      const filterDate =
        !dateRange.startDate || !dateRange.endDate
          ? true
          : dateRange.startDate && dateRange.endDate
            ? dateRange.startDate <= orderDate && orderDate <= dateRange.endDate
            : true;
      const filterCheckCode = searchInput
        ? order.checkCode.toLocaleLowerCase().includes(searchInput.toLocaleLowerCase())
        : true;
      return !order.isPaid && filterStatus && filterDate && filterCheckCode;
    });
  }, [orders, dateRange, selectedStatus, searchInput]);

  const pagination = usePagination({
    count: result.length
  });

  return (
    <Box className='flex flex-col min-h-screen bg-white px-6 py-4 text-black'>
      <OrderFilter
        statusList={orderStatusList}
        numberOfOrders={result.length}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        dateRange={dateRange}
        setDateRange={setDateRange}
        onSearch={setSearchInput}
      />
      <Box sx={{ flex: 1 }}>
        {loading ? (
          <Box display='flex' justifyContent='center' alignItems='center' height='100%'>
            <CircularProgress />
          </Box>
        ) : (
          <CustomTable
            rows={result}
            configs={orderTableConfig}
            pagination={pagination}
            className='my-5 -mx-6'
            onClickRow={(data) => handleGoReport(data)}
          />
        )}
      </Box>
    </Box>
  );
};

export default OrderNotPaid;
