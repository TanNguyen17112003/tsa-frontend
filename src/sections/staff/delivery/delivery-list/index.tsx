import React, { useMemo, useState } from 'react';
import { CustomTable } from '@components';
import { Box, SelectChangeEvent } from '@mui/material';
import usePagination from 'src/hooks/use-pagination';
import { useDialog, useDrawer } from '@hooks';
import { DeliveryDetail } from 'src/types/delivery';
import getDeliveryTableConfig from '../delivery-table-config';
import { useDeliveriesContext } from 'src/contexts/deliveries/deliveries-context';
import DeliveryFilter from './delivery-filter';
import { useFirebaseAuth, useAuth } from '@hooks';

function DeliveryList() {
  const { getDeliveriesApi } = useDeliveriesContext();
  const { user } = useAuth();
  const { user: firebaseUser } = useFirebaseAuth();
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const deleteDeliveryDialog = useDialog<DeliveryDetail>();
  const editDeliveryDrawer = useDrawer<DeliveryDetail>();

  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: null,
    endDate: null
  });

  const deliveries = useMemo(() => {
    return (getDeliveriesApi.data || []).filter(
      (delivery) => delivery.staffId === user?.id || delivery.staffId === firebaseUser?.id
    );
  }, [getDeliveriesApi.data, user, firebaseUser]);

  const filteredDeliveries = useMemo(() => {
    return deliveries.filter((delivery) => {
      const matchesDateRange =
        dateRange.startDate && dateRange.endDate
          ? new Date(Number(delivery.createdAt) * 1000) >= dateRange.startDate &&
            new Date(Number(delivery.createdAt) * 1000) <= dateRange.endDate
          : true;
      const matchesStatus =
        selectedStatus === '' ? true : delivery.DeliveryStatusHistory[0].status === selectedStatus;
      return matchesDateRange && matchesStatus;
    });
  }, [dateRange, selectedStatus, deliveries]);

  const deliveryTableConfig = useMemo(() => {
    return getDeliveryTableConfig({});
  }, []);

  const pagination = usePagination({
    count: deliveries.length
  });

  const handleDateChange = (range: { startDate: Date | null; endDate: Date | null }) => {
    setDateRange(range);
  };

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setSelectedStatus(event.target.value as string);
  };

  const handleResetFilters = () => {
    setSelectedStatus('');
    setDateRange({ startDate: null, endDate: null });
  };

  return (
    <Box className='px-6 text-black my-5'>
      <DeliveryFilter
        selectedStatus={selectedStatus}
        dateRange={dateRange}
        onDateChange={handleDateChange}
        onStatusChange={handleStatusChange}
        onResetFilters={handleResetFilters}
        numberOfDeliveries={deliveries.length}
      />
      <CustomTable
        rows={filteredDeliveries}
        configs={deliveryTableConfig}
        pagination={pagination}
      />
    </Box>
  );
}

export default DeliveryList;
