import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { CustomTable } from '@components';
import OrderFilter from './order-filter';
import getOrderTableConfigs from './order-table-config';
import { Box, Button, CircularProgress, Stack } from '@mui/material';
import { OrderDetail, OrderStatus } from 'src/types/order';
import { SelectChangeEvent } from '@mui/material';
import { useRouter } from 'next/router';
import { useOrdersContext } from 'src/contexts/orders/orders-context';
import { useDrawer, useDialog, useSelection } from '@hooks';
import useFunction from 'src/hooks/use-function';
import useStaffData from 'src/hooks/use-staff-data';
import useAppSnackbar from 'src/hooks/use-app-snackbar';
import { Additem, Trash, TickCircle } from 'iconsax-react';
import OrderDetailDeleteDialog from '../order-detail/order-detail-delete-dialog';
import OrderDetailEditDrawer from '../order-detail/order-detail-edit-drawer';
import OrderGroupDialog from './order-group-dialog';
import OrderDeleteWarningDialog from './order-delete-warning-dialog';
import OrderApproveWarningDialog from './order-approve-warning-dialog';
import OrderGroupWarningDialog from './order-group-warning-dialog';
import Pagination from 'src/components/ui/Pagination';

function OrderList() {
  const router = useRouter();
  const { showSnackbarError, showSnackbarSuccess } = useAppSnackbar();
  const [selectedDormitory, setSelectedDormitory] = useState<string>('');
  const [deletedOrders, setDeletedOrders] = useState<OrderDetail[]>([]);
  const [approvedOrders, setApprovedOrders] = useState<OrderDetail[]>([]);
  const [groupedOrders, setGroupedOrders] = useState<OrderDetail[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<string>('');
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: null,
    endDate: null
  });
  const {
    getOrdersApi,
    deleteOrder,
    updateOrderStatus,
    setOrderFilter,
    orderFilter,
    orderPagination
  } = useOrdersContext();
  const orderDetailDrawer = useDrawer<OrderDetail>();
  const orderDetailDeleteDialog = useDialog<OrderDetail>();
  const orderGroupDialog = useDialog<OrderDetail[]>();
  const orderDeleteWarningDialog = useDialog<OrderDetail[]>();
  const orderApproveWarningDialog = useDialog<OrderDetail[]>();
  const orderGroupWarningDialog = useDialog<OrderDetail[]>();

  const orders = useMemo(() => {
    return getOrdersApi.data?.results || [];
  }, [getOrdersApi.data, orderFilter]);

  const users = useStaffData();

  const select = useSelection<OrderDetail>(orders);
  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setSelectedStatus(event.target.value as string);
  };

  const handleDormitoryChange = (event: SelectChangeEvent<string>) => {
    setSelectedDormitory(event.target.value as string);
    setSelectedBuilding('');
    setSelectedRoom('');
  };

  const handleBuildingChange = (event: SelectChangeEvent<string>) => {
    setSelectedBuilding(event.target.value as string);
    setSelectedRoom('');
  };

  const handleRoomChange = (event: SelectChangeEvent<string>) => {
    setSelectedRoom(event.target.value as string);
  };

  const handleDateChange = (range: { startDate: Date | null; endDate: Date | null }) => {
    setDateRange(range);
  };

  const handleResetFilters = () => {
    setSelectedDormitory('');
    setSelectedBuilding('');
    setSelectedRoom('');
    setSelectedStatus('');
    setDateRange({ startDate: null, endDate: null });
  };

  const handleGoOrder = useCallback(
    (data: OrderDetail) => {
      router.push({
        pathname: router.pathname,
        query: { ...router.query, orderId: data.id }
      });
    },
    [router]
  );

  const numberOfOrders = useMemo(() => {
    return getOrdersApi.data?.totalElements || 0;
  }, [getOrdersApi.data]);

  const handleDeleteOrders = useCallback(
    async (orders: OrderDetail[]) => {
      const notDeletedOrders = orders?.filter((order) => order.latestStatus === 'IN_TRANSPORT');
      const deletedOrders = orders?.filter((order) => order.latestStatus !== 'IN_TRANSPORT');
      if (notDeletedOrders.length === orders.length) {
        showSnackbarError('Không thể xóa danh sách đơn hàng đang giao, đã giao hoặc đã xác nhận');
      } else if (notDeletedOrders.length === 0) {
        await deleteOrder(deletedOrders.map((order) => order.id));
        showSnackbarSuccess('Xóa các đơn hàng thành công');
      } else if (notDeletedOrders.length < orders.length) {
        orderDeleteWarningDialog.handleOpen(notDeletedOrders);
        setDeletedOrders(deletedOrders);
      }
    },
    [
      orderDeleteWarningDialog,
      setDeletedOrders,
      deleteOrder,
      showSnackbarError,
      showSnackbarSuccess
    ]
  );

  const handleApproveOrders = useCallback(
    async (orders: OrderDetail[]) => {
      const notApprovedOrders = orders?.filter(
        (order) =>
          order.latestStatus !== 'PENDING' ||
          !order.studentId ||
          (order.latestStatus === 'PENDING' && !order.isPaid && order.paymentMethod !== 'CASH')
      );
      const approvedOrders = orders?.filter(
        (order) =>
          (order.latestStatus === 'PENDING' &&
            order.studentId &&
            order.paymentMethod !== 'CASH' &&
            order.isPaid) ||
          (order.latestStatus === 'PENDING' && order.studentId && order.paymentMethod === 'CASH')
      );
      if (notApprovedOrders.length === orders.length) {
        showSnackbarError('Không thể phê duyệt danh sách đơn hàng này');
      } else if (notApprovedOrders.length === 0) {
        await updateOrderStatus(
          'ACCEPTED',
          approvedOrders.map((order) => order.id)
        );
        showSnackbarSuccess('Phê duyệt các đơn hàng thành công');
      } else if (notApprovedOrders.length < orders.length) {
        orderApproveWarningDialog.handleOpen(notApprovedOrders);
        setApprovedOrders(approvedOrders);
      }
    },
    [
      orderApproveWarningDialog,
      setApprovedOrders,
      updateOrderStatus,
      showSnackbarError,
      showSnackbarSuccess
    ]
  );

  const handleGroupOrders = useCallback(async (orders: OrderDetail[]) => {
    const notGroupedOrders = orders.filter(
      (order) =>
        (order.latestStatus !== 'CANCELLED' && order.shipperId) ||
        (order.latestStatus !== 'ACCEPTED' && !order.shipperId) ||
        (order.latestStatus === 'ACCEPTED' &&
          !order.shipperId &&
          order.paymentMethod !== 'CASH' &&
          !order.isPaid)
    );
    const groupedOrders = orders.filter(
      (order) =>
        (order.latestStatus === 'ACCEPTED' && !order.shipperId) ||
        (order.latestStatus === 'ACCEPTED' &&
          !order.shipperId &&
          order.paymentMethod !== 'CASH' &&
          order.isPaid) ||
        (order.latestStatus === 'CANCELLED' && order.shipperId)
    );
    if (notGroupedOrders.length === orders.length) {
      showSnackbarError('Không thể gom nhóm danh sách đơn hàng này vì không đạt điều kiện!');
    } else if (notGroupedOrders.length === 0) {
      setGroupedOrders(groupedOrders);
      await orderGroupDialog.handleOpen(groupedOrders);
    } else if (notGroupedOrders.length < orders.length) {
      orderGroupWarningDialog.handleOpen(notGroupedOrders);
      setGroupedOrders(groupedOrders);
    }
  }, []);

  const handleDeleteOrdersHelper = useFunction(handleDeleteOrders, {});

  const handleApproveOrdersHelper = useFunction(handleApproveOrders, {});

  const filteredOrders = useMemo(() => {
    return orders?.filter((order) => {
      const matchesDormitory = selectedDormitory ? order.dormitory === selectedDormitory : true;
      const matchesBuilding = selectedBuilding ? order.building === selectedBuilding : true;
      const matchesRoom = selectedRoom ? order.room === selectedRoom : true;
      const matchesDateRange =
        dateRange.startDate && dateRange.endDate
          ? new Date(Number(order.deliveryDate) * 1000) >= dateRange.startDate &&
            new Date(Number(order.deliveryDate) * 1000) <= dateRange.endDate
          : true;
      const matchesStatus = selectedStatus === '' ? true : order.latestStatus === selectedStatus;
      return (
        matchesDormitory && matchesBuilding && matchesRoom && matchesDateRange && matchesStatus
      );
    });
  }, [selectedDormitory, selectedBuilding, selectedRoom, dateRange, selectedStatus, orders]);

  useEffect(() => {
    setOrderFilter({
      ...orderFilter,
      page: orderPagination.page + 1,
      status: selectedStatus as OrderStatus,
      dateRange: dateRange
    });
  }, [orderPagination.page, selectedStatus, dateRange]);

  const handleDeleteOrder = useCallback(
    (order: OrderDetail) => {
      if (order.latestStatus === 'IN_TRANSPORT') {
        showSnackbarError(
          `Không thể xóa đơn hàng ${order.latestStatus === 'IN_TRANSPORT' ? 'đang giao' : ''}`
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
          `Không thể chỉnh sửa đơn hàng ${order.latestStatus === 'IN_TRANSPORT' ? 'đang giao' : order.latestStatus === 'DELIVERED' ? 'đã giao' : ''}`
        );
      } else {
        orderDetailDrawer.handleOpen(order);
      }
    },
    [showSnackbarError, orderDetailDrawer]
  );

  const handleConfirmDeleteOrders = useCallback(async () => {
    await deleteOrder(deletedOrders.map((order) => order.id));
    setDeletedOrders([]);
  }, [setDeletedOrders, deleteOrder, deletedOrders]);

  const handleConfirmApproveOrders = useCallback(async () => {
    await updateOrderStatus(
      'ACCEPTED',
      approvedOrders.map((order) => order.id)
    );
    setApprovedOrders([]);
  }, [setApprovedOrders, updateOrderStatus, approvedOrders]);

  const handleConfirmDeleteOrdersHelper = useFunction(handleConfirmDeleteOrders, {
    successMessage: 'Xóa các đơn hàng thành công'
  });
  const handleConfirmApproveOrdersHelper = useFunction(handleConfirmApproveOrders, {
    successMessage: 'Phê duyệt các đơn hàng thành công'
  });

  const orderTableConfig = useMemo(() => {
    return getOrderTableConfigs({
      onClickDelete: (data: any) => {
        handleDeleteOrder(data);
      },
      onClickEdit: (data: any) => {
        handleEditOrder(data);
      },
      users: users.users
    });
  }, [users, handleDeleteOrder, handleEditOrder]);

  const isLoading =
    handleDeleteOrdersHelper.loading ||
    handleApproveOrdersHelper.loading ||
    handleConfirmDeleteOrdersHelper.loading ||
    handleConfirmApproveOrdersHelper.loading;

  return (
    <Box className='px-6 text-black min-h-screen'>
      <OrderFilter
        selectedDormitory={selectedDormitory}
        selectedBuilding={selectedBuilding}
        selectedRoom={selectedRoom}
        selectedStatus={selectedStatus}
        dateRange={dateRange}
        onDormitoryChange={handleDormitoryChange}
        onStatusChange={handleStatusChange}
        onBuildingChange={handleBuildingChange}
        onRoomChange={handleRoomChange}
        onDateChange={handleDateChange}
        onResetFilters={handleResetFilters}
        numberOfOrders={numberOfOrders}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          mb: 3,
          gap: 2
        }}
      >
        <Button
          variant='contained'
          color='success'
          startIcon={<TickCircle color='white' />}
          onClick={() => handleApproveOrdersHelper.call(select.selected)}
          disabled={select.selected.length === 0}
        >
          Phê duyệt
        </Button>
        <Button
          variant='contained'
          color='error'
          startIcon={<Trash color='white' />}
          onClick={() => handleDeleteOrdersHelper.call(select.selected)}
          disabled={select.selected.length === 0}
        >
          Xóa
        </Button>
        <Button
          variant='outlined'
          color='primary'
          startIcon={<Additem />}
          onClick={() => handleGroupOrders(select.selected)}
          disabled={select.selected.length === 0}
        >
          Gom nhóm đơn hàng
        </Button>
      </Box>
      {getOrdersApi.loading ? (
        <Box className='flex items-center justify-center h-[300px]'>
          <CircularProgress />
        </Box>
      ) : (
        <Stack spacing={2} mt={1}>
          <CustomTable
            select={select}
            rows={orders}
            configs={orderTableConfig}
            onClickRow={(data: OrderDetail) => handleGoOrder(data)}
          />
          <Pagination
            page={orderPagination.page}
            count={numberOfOrders}
            onChange={orderPagination.onPageChange}
            rowsPerPage={orderPagination.rowsPerPage}
          />
        </Stack>
      )}

      <OrderDetailDeleteDialog
        open={orderDetailDeleteDialog.open}
        onClose={orderDetailDeleteDialog.handleClose}
        order={orderDetailDeleteDialog.data as OrderDetail}
        onConfirm={() => deleteOrder([orderDetailDeleteDialog.data?.id] as string[])}
      />
      <OrderDetailEditDrawer
        open={orderDetailDrawer.open}
        onClose={orderDetailDrawer.handleClose}
        order={orderDetailDrawer.data}
      />
      <OrderGroupDialog
        orders={groupedOrders}
        open={orderGroupDialog.open}
        onClose={orderGroupDialog.handleClose}
      />
      <OrderDeleteWarningDialog
        orders={orderDeleteWarningDialog.data as OrderDetail[]}
        open={orderDeleteWarningDialog.open}
        onClose={orderDeleteWarningDialog.handleClose}
        onConfirm={() => handleConfirmDeleteOrdersHelper.call({})}
      />
      <OrderApproveWarningDialog
        orders={orderApproveWarningDialog.data as OrderDetail[]}
        open={orderApproveWarningDialog.open}
        onClose={orderApproveWarningDialog.handleClose}
        onConfirm={() => handleConfirmApproveOrdersHelper.call({})}
      />
      <OrderGroupWarningDialog
        orders={orderGroupWarningDialog.data as OrderDetail[]}
        open={orderGroupWarningDialog.open}
        onClose={orderGroupWarningDialog.handleClose}
        onConfirm={orderGroupDialog.handleOpen}
      />
      {isLoading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            zIndex: 9999
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
}

export default OrderList;
