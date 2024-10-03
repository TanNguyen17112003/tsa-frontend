import React, { useState, useMemo } from 'react';
import { CustomTable } from '@components';
import OrderFilter from './order-filter';
import getOrderTableConfigs from './order-table-config';
import { Box } from '@mui/material';
import { initialOrderList, Order } from 'src/types/order';
import usePagination from 'src/hooks/use-pagination';
import { SelectChangeEvent } from '@mui/material';

function OrderList() {
  const [selectedDormitory, setSelectedDormitory] = useState<string>('');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('');
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: null,
    endDate: null
  });

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

  const filteredOrders = useMemo(() => {
    return initialOrderList.filter((order) => {
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
  }, [selectedDormitory, selectedBuilding, selectedRoom, dateRange, selectedStatus]);

  const pagination = usePagination({
    count: filteredOrders.length
  });

  const orderTableConfig = useMemo(() => {
    return getOrderTableConfigs({
      onClickDelete: (data: any) => {
        console.log('Delete', data);
      },
      onClickEdit: (data: any) => {
        console.log('Edit', data);
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
      />
      <CustomTable rows={filteredOrders} configs={orderTableConfig} pagination={pagination} />
    </Box>
  );
}

export default OrderList;
