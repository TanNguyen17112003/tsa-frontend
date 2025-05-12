import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { CustomTable } from '@components';
import OrderFilter from './order-filter';
import getOrderTableConfigs from './order-table-config';
import { Box, Button, CircularProgress, InputAdornment, Stack, TextField } from '@mui/material';
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
import { SearchIcon } from 'lucide-react';
import { unixTimestampToDate } from 'src/utils/format-time-currency';
import OrderFastGroupDialog from './order-fast-group-dialog';
import LoadingProcess from 'src/components/LoadingProcess';

function OrderList() {
  const router = useRouter();
  const { showSnackbarError, showSnackbarSuccess } = useAppSnackbar();
  const [searchInput, setSearchInput] = useState('');
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
  const orderFastGroupDialog = useDialog();

  const orders = useMemo(() => {
    return getOrdersApi.data?.results || [];
  }, [getOrdersApi.data, orderFilter]);

  const handleSearch = useCallback(() => {
    setOrderFilter({
      ...orderFilter,
      search: searchInput
    });
  }, [searchInput]);

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

  const handleOrderFastGroup = useCallback(() => {
    orderFastGroupDialog.handleOpen();
  }, []);

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
        (order) => !order.studentId || order.latestStatus !== 'PENDING'
      );
      const approvedOrders = orders?.filter((order) => !notApprovedOrders.includes(order));
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
    if (orders.length === 0) {
      showSnackbarError('Không thể gom nhóm danh sách đơn hàng trống!');
      return;
    }
    const deliveryDate = unixTimestampToDate(orders[0].deliveryDate);
    const notSatisfiedOrders = orders.filter(
      (order) =>
        unixTimestampToDate(order.deliveryDate).getDay() !== deliveryDate.getDay() ||
        unixTimestampToDate(order.deliveryDate).getMonth() !== deliveryDate.getMonth() ||
        unixTimestampToDate(order.deliveryDate).getFullYear() !== deliveryDate.getFullYear()
    );
    const notSameDormitoryOrders = orders.filter(
      (order) => order.dormitory !== orders[0].dormitory
    );
    if (notSameDormitoryOrders.length > 0) {
      showSnackbarError('Không thể gom nhóm danh sách đơn hàng này vì không cùng khu!');
      return;
    }
    if (notSatisfiedOrders.length > 0) {
      showSnackbarError(
        'Không thể gom nhóm danh sách đơn hàng này vì ngày giao hàng không giống nhau!'
      );
      return;
    }
    const notGroupedOrders = orders.filter(
      (order) =>
        (order.paymentMethod === 'CREDIT' && !order.isPaid) ||
        (!order.shipperId && order.latestStatus !== 'ACCEPTED') ||
        (order.shipperId && order.latestStatus !== 'CANCELED')
    );
    const groupedOrders = orders.filter((order) => !notGroupedOrders.includes(order));
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
    getOrdersApi.loading ||
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
          justifyContent: 'space-between',
          mb: 3,
          gap: 2
        }}
      >
        <TextField
          variant='outlined'
          placeholder='Tìm kiếm theo mã đơn hoặc sản phẩm'
          className='w-[35%]'
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end' className='cursor-pointer' onClick={handleSearch}>
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
        <Stack direction={'row'} alignItems={'center'} gap={1}>
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
          <Button
            variant='contained'
            color='success'
            startIcon={<Additem />}
            onClick={handleOrderFastGroup}
          >
            Gom nhóm nhanh
          </Button>
        </Stack>
      </Box>
      {getOrdersApi.loading ? (
        <LoadingProcess />
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
      <OrderFastGroupDialog
        open={orderFastGroupDialog.open}
        onClose={orderFastGroupDialog.handleClose}
      />
      {isLoading && <LoadingProcess />}
    </Box>
  );
}

export default OrderList;
