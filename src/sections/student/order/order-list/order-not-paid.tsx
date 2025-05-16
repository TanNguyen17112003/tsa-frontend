import React, { useCallback, useState, useMemo, useEffect } from 'react';
import OrderFilter from './order-filter';
import { Box, CircularProgress, Stack } from '@mui/material';
import { OrderDetail, OrderStatus, orderStatusMap } from 'src/types/order';
import getOrderTableConfigs from './order-table-config';
import { CustomTable } from '@components';
import { useRouter } from 'next/router';
import { useOrdersContext } from 'src/contexts/orders/orders-context';
import { formatUnixTimestamp, unixTimestampToDate } from 'src/utils/format-time-currency';
import { PaymentsApi } from 'src/api/payment';
import OrderDetailReportDrawer from './order-detail-report-drawer';
import OrderDetailDeleteDialog from './order-detail-delete-dialog';
import OrderDetailEditDrawer from './order-detail-edit-drawer';
import { useDrawer, useDialog } from '@hooks';
import useAppSnackbar from 'src/hooks/use-app-snackbar';
import { usePayOS, PayOSConfig } from 'payos-checkout';
import Pagination from 'src/components/ui/Pagination';
import { useSocketContext } from 'src/contexts/socket-client/socket-client-context';
import { paths } from 'src/paths';
import { OrdersApi } from 'src/api/orders';
import LoadingProcess from 'src/components/LoadingProcess';
import OrderDetailCancelDialog from './order-detail-cancel-dialog';

const OrderNotPaid: React.FC = () => {
  const { socket } = useSocketContext();
  const router = useRouter();
  const { getOrdersApi, orderPagination, orderFilter, setOrderFilter, deleteOrder, updateOrder } =
    useOrdersContext();
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
        showSnackbarSuccess('Thanh toán bị hủy');
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
  const orderDetailCancelDialog = useDialog<OrderDetail>();
  const orderDetailEditDrawer = useDrawer<OrderDetail>();

  const orders = useMemo(() => {
    return getOrdersApi.data?.results || [];
  }, [getOrdersApi.data]);

  const [selectedStatus, setSelectedStatus] = useState<string>('Tất cả');
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null
  });
  const [searchInput, setSearchInput] = useState<string>('');

  useEffect(() => {
    setOrderFilter({
      ...orderFilter,
      isPaid: false,
      status: selectedStatus !== 'Tất cả' ? (selectedStatus as OrderStatus) : undefined,
      dateRange,
      search: searchInput,
      page: orderPagination.page + 1
    });
  }, [selectedStatus, dateRange, searchInput, orderPagination.page]);

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
        if (order.latestStatus === 'REJECTED' || order.latestStatus === 'CANCELED') {
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
              amount: order.remainingAmount || 2000,
              description: 'Thanh toán đơn hàng',
              returnUrl: `${window.location.origin}/student/order`,
              cancelUrl: `${window.location.origin}/student/order`,
              extraData: order.id
            });
            if (paymentResponse && paymentResponse.paymentLink.checkoutUrl) {
              setCheckoutUrl(paymentResponse.paymentLink.checkoutUrl);
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
      onClickCancel: (data: OrderDetail) => {
        orderDetailCancelDialog.handleOpen(data);
      },
      isPaid: false
    });
  }, [handlePayment, handleReportOrder, handleEditOrder, handleDeleteOrder]);

  const result = useMemo(() => {
    return orders;
  }, [orders]);

  useEffect(() => {
    if (socket && order?.id && checkoutUrl) {
      const paymentUpdateHandler = async (data: any) => {
        console.log('Payment update: ' + JSON.stringify(data));
        if (data.isPaid) {
          await updateOrder(
            {
              deliveryDate: unixTimestampToDate(order?.deliveryDate as string).toString(),
              isPaid: true
            },
            order?.id as string
          );
          await showSnackbarSuccess('Thanh toán thành công');
          await setCheckoutUrl('');
          setTimeout(() => {
            router.push({
              pathname: router.pathname,
              query: { ...router.query, orderId: order?.id }
            });
          }, 2000);
        } else {
          await setCheckoutUrl('');
          setTimeout(() => {
            router.push({
              pathname: router.pathname,
              query: { ...router.query, orderId: order?.id }
            });
          }, 2000);
        }
      };

      socket.emit('subscribeToPayment', { orderId: order.id });
      console.log('Subscribe to payment with ' + order.id);
      socket.on('paymentUpdate', paymentUpdateHandler);

      return () => {
        socket.emit('unsubscribeFromPayment', { orderId: order?.id });
        console.log(`Unsubscribe from payment with ${order?.id}`);
        socket.off('paymentUpdate', paymentUpdateHandler);
      };
    }
  }, [socket, order?.id, checkoutUrl, updateOrder]);

  return (
    <>
      <Box id='payos-checkout-iframe' className='absolute top-0 left-0 w-full h-full' />
      <Box className='flex flex-col min-h-screen bg-white px-6 py-4 text-black'>
        <OrderFilter
          statusList={orderStatusList}
          numberOfOrders={getOrdersApi.data?.totalElements || 0}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          dateRange={dateRange}
          setDateRange={setDateRange}
          onSearch={setSearchInput}
        />
        <Box sx={{ flex: 1 }}>
          {getOrdersApi.loading ? (
            <LoadingProcess />
          ) : (
            <Stack spacing={2} mt={3}>
              <CustomTable
                rows={result}
                configs={orderTableConfig}
                className='my-5 -mx-6'
                onClickRow={(data) => handleGoReport(data)}
              />
              <Pagination
                page={orderPagination.page}
                count={getOrdersApi.data?.totalElements || 0}
                rowsPerPage={orderPagination.rowsPerPage}
                onChange={orderPagination.onPageChange}
              />
            </Stack>
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
        <OrderDetailCancelDialog
          open={orderDetailCancelDialog.open}
          onClose={orderDetailCancelDialog.handleClose}
          order={orderDetailCancelDialog.data as OrderDetail}
        />
      </Box>
    </>
  );
};

export default OrderNotPaid;
