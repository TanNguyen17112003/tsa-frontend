import React, { useCallback, useState, useMemo, useEffect } from 'react';
import OrderFilter from './order-filter';
import { Box, Typography, CircularProgress } from '@mui/material';
import { OrderDetail } from 'src/types/order';
import getOrderTableConfigs from './order-table-config';
import { CustomTable } from '@components';
import usePagination from 'src/hooks/use-pagination';
import { useRouter } from 'next/router';
import OrderDetailReportDrawer from './order-detail-report-drawer';
import { useDrawer, useDialog } from '@hooks';
import OrderDetailDeleteDialog from './order-detail-delete-dialog';
import { useOrdersContext } from 'src/contexts/orders/orders-context';
import { formatUnixTimestamp, unixTimestampToDate } from 'src/utils/format-time-currency';
import OrderDetailEditDrawer from './order-detail-edit-drawer';
import { PaymentsApi } from 'src/api/payment';
import { usePayOS, PayOSConfig } from 'payos-checkout';
import useAppSnackbar from 'src/hooks/use-app-snackbar';

interface OrderNotPaidProps {
  orders: OrderDetail[];
  loading: boolean;
}

const OrderNotPaid: React.FC<OrderNotPaidProps> = ({ orders, loading }) => {
  const router = useRouter();
  const { deleteOrder, updateOrder } = useOrdersContext();
  const { showSnackbarSuccess, showSnackbarError } = useAppSnackbar();
  const [checkoutUrl, setCheckoutUrl] = useState<string>('');
  const [order, setOrder] = useState<OrderDetail>();
  const payOSConfig: PayOSConfig = useMemo(() => {
    return {
      RETURN_URL: `${window.location.origin}/student/order`,
      ELEMENT_ID: 'payos-checkout-iframe',
      CHECKOUT_URL: checkoutUrl,
      onSuccess: (event: any) => {
        updateOrder(
          {
            deliveryDate: unixTimestampToDate(order?.deliveryDate as string).toString(),
            isPaid: true
          },
          order?.id as string
        );
        showSnackbarSuccess('Thanh toán thành công');
        setCheckoutUrl('');
      },
      onCancel: (event: any) => {
        showSnackbarError('Thanh toán bị hủy');
        setCheckoutUrl('');
      }
    };
  }, [checkoutUrl, order, updateOrder, setCheckoutUrl]);
  const { open } = usePayOS(payOSConfig);

  useEffect(() => {
    if (checkoutUrl) {
      open();
    }
  }, [checkoutUrl, open]);
  const orderStatusList = [
    'Tất cả',
    'Đã giao',
    'Đã hủy',
    'Đang giao',
    'Đã xác nhận',
    'Đang chờ xử lý',
    'Đã từ chối'
  ];
  const orderDetailReportDrawer = useDrawer<OrderDetail>();
  const orderDetailDeleteDialog = useDialog<OrderDetail>();
  const orderDetailEditDrawer = useDrawer<OrderDetail>();

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
        if (order.latestStatus === 'REJECTED' || order.latestStatus === 'CANCELLED') {
          showSnackbarError(
            `Không thể thanh toán đơn hàng ${
              order.latestStatus === 'REJECTED' ? 'đã từ chối' : 'đã hủy'
            }`
          );
        } else {
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
                isPaid: false
              },
              order.id
            );
          } else if (order.paymentMethod === 'CREDIT') {
            setOrder(order);
            const paymentResponse = await PaymentsApi.postPayOSPayment({
              orderId: order.id,
              amount: order.shippingFee || 2000,
              description: 'Thanh toán đơn hàng ' + order.checkCode,
              returnUrl: `${window.location.origin}/student/order`,
              cancelUrl: `${window.location.origin}/student/order`,
              extraData: order.id
            });
            if (paymentResponse && paymentResponse.checkoutUrl) {
              setCheckoutUrl(paymentResponse.checkoutUrl);
            }
          }
        }
      } catch (error) {
        console.error('Payment error:', error);
        showSnackbarError('Có lỗi xảy ra khi thanh toán');
      }
    },
    [updateOrder, showSnackbarError, setCheckoutUrl, PaymentsApi]
  );

  const handleDeleteOrder = useCallback(
    (order: OrderDetail) => {
      if (
        order.latestStatus === 'IN_TRANSPORT' ||
        order.latestStatus === 'DELIVERED' ||
        order.latestStatus === 'ACCEPTED'
      ) {
        showSnackbarError(
          `Không thể xóa đơn hàng ${order.latestStatus === 'IN_TRANSPORT' ? 'đang giao' : order.latestStatus === 'DELIVERED' ? 'đã giao' : 'đã xác nhận'}`
        );
      } else {
        orderDetailDeleteDialog.handleOpen(order);
      }
    },
    [orderDetailDeleteDialog, showSnackbarError]
  );

  const handleEditOrder = useCallback(
    (order: OrderDetail) => {
      if (order.latestStatus === 'IN_TRANSPORT' || order.latestStatus === 'DELIVERED') {
        showSnackbarError(
          `Không thể chỉnh sửa đơn hàng ${order.latestStatus === 'IN_TRANSPORT' ? 'đang giao' : order.latestStatus === 'DELIVERED' ? 'đã giao' : 'đã xác nhận'}`
        );
      } else {
        orderDetailEditDrawer.handleOpen(order);
      }
    },
    [showSnackbarError, orderDetailEditDrawer]
  );

  const handleReportOrder = useCallback(
    (order: OrderDetail) => {
      if (order.latestStatus !== 'IN_TRANSPORT' && order.latestStatus !== 'DELIVERED') {
        showSnackbarError('Không thể khiếu nại đơn hàng chưa được vận hành');
      } else {
        orderDetailReportDrawer.handleOpen(order);
      }
    },
    [showSnackbarError, orderDetailReportDrawer]
  );

  const orderTableConfig = useMemo(() => {
    return getOrderTableConfigs({
      onClickReport: (data: OrderDetail) => {
        handleReportOrder(data);
      },
      onClickEdit: (data: OrderDetail) => {
        handleEditOrder(data);
      },
      onClickDelete: (data: OrderDetail) => {
        handleDeleteOrder(data);
      },
      onClickPayment: (data: OrderDetail) => {
        handlePayment(data);
      },
      isPaid: false
    });
  }, [handlePayment, orderDetailReportDrawer, orderDetailDeleteDialog, orderDetailEditDrawer]);

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

  // I want to console.log checkoutUrl after interval of 3 seconds
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     console.log(checkoutUrl);
  //   }, 3000);
  //   return () => clearInterval(interval);
  // }, [checkoutUrl]);

  return (
    <>
      <Box id='payos-checkout-iframe' className='absolute top-0 left-0 w-full h-full' />
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
        <OrderDetailReportDrawer
          open={orderDetailReportDrawer.open}
          onClose={orderDetailReportDrawer.handleClose}
          order={orderDetailReportDrawer.data}
        />
        <OrderDetailDeleteDialog
          open={orderDetailDeleteDialog.open}
          onClose={orderDetailDeleteDialog.handleClose}
          order={orderDetailDeleteDialog.data as OrderDetail}
          onConfirm={() => deleteOrder([orderDetailDeleteDialog.data?.id] as string[])}
        />
        <OrderDetailEditDrawer
          open={orderDetailEditDrawer.open}
          onClose={orderDetailEditDrawer.handleClose}
          order={orderDetailEditDrawer.data}
        />
        {/* <Chat /> */}
      </Box>
    </>
  );
};

export default OrderNotPaid;
