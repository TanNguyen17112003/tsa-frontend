import React, { useState, useMemo, useCallback } from 'react';
import { CustomTable } from '@components';
import OrderFilter from './order-filter';
import getOrderTableConfigs from './order-table-config';
import { Box, Button } from '@mui/material';
import { Order, OrderDetail } from 'src/types/order';
import usePagination from 'src/hooks/use-pagination';
import { SelectChangeEvent } from '@mui/material';
import { useRouter } from 'next/router';
import { useOrdersContext } from 'src/contexts/orders/orders-context';
import { useDrawer, useDialog } from '@hooks';
import OrderDetailDeleteDialog from './order-detail-delete-dialog';
import OrderDetailEditDrawer from './order-detail-edit-drawer';
import { useSelection } from '@hooks';
import { Additem } from 'iconsax-react';
import OrderGroupDialog from './order-group-dialog';

function OrderList() {
  const router = useRouter();
  const [selectedDormitory, setSelectedDormitory] = useState<string>('');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('');
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: null,
    endDate: null
  });
  const { getOrdersApi, deleteOrder } = useOrdersContext();
  const orderDetailDrawer = useDrawer<OrderDetail>();
  const orderDetailDeleteDialog = useDialog<OrderDetail>();
  const orderGroupDialog = useDialog<OrderDetail[]>();

  const orders = useMemo(() => {
    return getOrdersApi.data || [];
  }, [getOrdersApi.data]);

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

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
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
    count: filteredOrders.length
  });

  const orderTableConfig = useMemo(() => {
    return getOrderTableConfigs({
      onClickDelete: (data: any) => {
        orderDetailDeleteDialog.handleOpen(data);
      },
      onClickEdit: (data: any) => {
        orderDetailDrawer.handleOpen(data);
      }
    });
  }, []);

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
        numberOfOrders={filteredOrders.length}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          mb: 3
        }}
      >
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
      <CustomTable
        select={select}
        rows={filteredOrders}
        configs={orderTableConfig}
        pagination={pagination}
        onClickRow={(data: OrderDetail) => handleGoOrder(data)}
      />
      <OrderDetailDeleteDialog
        open={orderDetailDeleteDialog.open}
        onClose={orderDetailDeleteDialog.handleClose}
        order={orderDetailDeleteDialog.data as OrderDetail}
        onConfirm={() => deleteOrder(orderDetailDeleteDialog.data?.id as string)}
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
    </Box>
  );
}

export default OrderList;
