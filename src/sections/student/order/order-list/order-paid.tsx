import React, { useCallback, useState, useMemo, useEffect } from 'react';
import OrderFilter from './order-filter';
import { Box, CircularProgress, Stack } from '@mui/material';
import { OrderDetail, OrderStatus, orderStatusMap } from 'src/types/order';
import getOrderTableConfigs from './order-table-config';
import { CustomTable } from '@components';
import { useRouter } from 'next/router';
import { useOrdersContext } from 'src/contexts/orders/orders-context';
import OrderDetailReportDrawer from './order-detail-report-drawer';
import OrderDetailDeleteDialog from './order-detail-delete-dialog';
import OrderDetailEditDrawer from './order-detail-edit-drawer';
import { useDrawer, useDialog } from '@hooks';
import useAppSnackbar from 'src/hooks/use-app-snackbar';
import Pagination from 'src/components/ui/Pagination';

const OrderNotPaid: React.FC = () => {
  const router = useRouter();
  const { getOrdersApi, orderPagination, orderFilter, setOrderFilter, deleteOrder } =
    useOrdersContext();
  const { showSnackbarSuccess, showSnackbarError } = useAppSnackbar();

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

  const orders = useMemo(() => {
    return getOrdersApi.data?.results || [];
  }, [getOrdersApi]);

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
      isPaid: true,
      status: selectedStatus !== 'Tất cả' ? (selectedStatus as OrderStatus) : undefined,
      dateRange,
      search: searchInput,
      page: orderPagination.page + 1
    });
  }, [selectedStatus, dateRange, searchInput, orderPagination.page, dateRange]);

  const handleGoReport = useCallback(
    (data: OrderDetail) => {
      router.replace({
        pathname: router.pathname,
        query: { ...router.query, orderId: data.id }
      });
    },
    [router]
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
      isPaid: true
    });
  }, [handleReportOrder, handleEditOrder, handleDeleteOrder]);

  const result = useMemo(() => {
    return orders;
  }, [orders]);

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
            <Box display='flex' justifyContent='center' alignItems='center' height='100%'>
              <CircularProgress />
            </Box>
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
      </Box>
    </>
  );
};

export default OrderNotPaid;
