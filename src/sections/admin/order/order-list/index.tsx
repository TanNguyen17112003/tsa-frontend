import React, { useState, useMemo, useCallback } from 'react';
import { CustomTable } from '@components';
import OrderFilter from './order-filter';
import getOrderTableConfigs from './order-table-config';
import { Box, Button, CircularProgress } from '@mui/material';
import { Order, OrderDetail } from 'src/types/order';
import usePagination from 'src/hooks/use-pagination';
import { SelectChangeEvent } from '@mui/material';
import { useRouter } from 'next/router';
import { useOrdersContext } from 'src/contexts/orders/orders-context';
import { useDrawer, useDialog } from '@hooks';
import OrderDetailDeleteDialog from '../order-detail/order-detail-delete-dialog';
import OrderDetailEditDrawer from '../order-detail/order-detail-edit-drawer';
import { useSelection } from '@hooks';
import { Additem, Trash, TickCircle } from 'iconsax-react';
import OrderGroupDialog from './order-group-dialog';
import useFunction from 'src/hooks/use-function';
import useStaffData from 'src/hooks/use-staff-data';
import useAppSnackbar from 'src/hooks/use-app-snackbar';
import OrderDeleteWarningDialog from './order-delete-warning-dialog';
import OrderApproveWarningDialog from './order-approve-warning-dialog';

function OrderList() {
  const router = useRouter();
  const { showSnackbarError, showSnackbarSuccess } = useAppSnackbar();
  const [selectedDormitory, setSelectedDormitory] = useState<string>('');
  const [deletedOrders, setDeletedOrders] = useState<OrderDetail[]>([]);
  const [approvedOrders, setApprovedOrders] = useState<OrderDetail[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<string>('');
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: null,
    endDate: null
  });
  const { getOrdersApi, deleteOrder, updateOrderStatus } = useOrdersContext();
  const orderDetailDrawer = useDrawer<OrderDetail>();
  const orderDetailDeleteDialog = useDialog<OrderDetail>();
  const orderGroupDialog = useDialog<OrderDetail[]>();
  const orderDeleteWarningDialog = useDialog<OrderDetail[]>();
  const orderApproveWarningDialog = useDialog<OrderDetail[]>();

  const orders = useMemo(() => {
    return getOrdersApi.data?.results || [];
  }, [getOrdersApi.data]);

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

  const handleGoOrder = useCallback((data: OrderDetail) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, orderId: data.id }
    });
  }, []);

  const numberOfOrders = useMemo(() => {
    return getOrdersApi.data?.totalElements || 0;
  }, [getOrdersApi.data]);

  const handleDeleteOrders = useCallback(
    async (orders: OrderDetail[]) => {
      const notDeletedOrders = orders?.filter(
        (order) =>
          order.latestStatus === 'IN_TRANSPORT' ||
          order.latestStatus === 'DELIVERED' ||
          order.latestStatus === 'ACCEPTED'
      );
      const deletedOrders = orders?.filter(
        (order) =>
          order.latestStatus !== 'IN_TRANSPORT' &&
          order.latestStatus !== 'DELIVERED' &&
          order.latestStatus !== 'ACCEPTED'
      );
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
    [orderDeleteWarningDialog, setDeletedOrders]
  );

  const handleApproveOrders = useCallback(
    async (orders: OrderDetail[]) => {
      const notApprovedOrders = orders?.filter(
        (order) => order.latestStatus !== 'PENDING' || !order.studentId
      );
      const approvedOrders = orders?.filter(
        (order) => order.latestStatus === 'PENDING' && order.studentId
      );
      if (notApprovedOrders.length === orders.length) {
        showSnackbarError('Không thể phê duyệt danh sách đơn hàng đang này');
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
    [orderApproveWarningDialog, setApprovedOrders]
  );

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

  const pagination = usePagination({
    count: numberOfOrders
  });

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
  }, [users]);

  return (
    <Box className='px-6 text-black'>
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
          onClick={() => orderGroupDialog.handleOpen()}
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
        <CustomTable
          select={select}
          rows={filteredOrders}
          configs={orderTableConfig}
          pagination={pagination}
          onClickRow={(data: OrderDetail) => handleGoOrder(data)}
        />
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
        orders={select.selected}
        open={orderGroupDialog.open}
        onClose={orderGroupDialog.handleClose}
      />
      <OrderDeleteWarningDialog
        orders={orderDeleteWarningDialog.data as OrderDetail[]}
        open={orderDeleteWarningDialog.open}
        onClose={orderDeleteWarningDialog.handleClose}
        onConfirm={handleConfirmDeleteOrders}
      />
      <OrderApproveWarningDialog
        orders={orderApproveWarningDialog.data as OrderDetail[]}
        open={orderApproveWarningDialog.open}
        onClose={orderApproveWarningDialog.handleClose}
        onConfirm={handleConfirmApproveOrders}
      />
    </Box>
  );
}

export default OrderList;
