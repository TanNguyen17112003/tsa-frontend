import React, { useMemo, useState } from 'react';
import { CustomTable } from '@components';
import { Box, SelectChangeEvent } from '@mui/material';
import usePagination from 'src/hooks/use-pagination';
import { useRouter } from 'next/router';
import { useDialog, useDrawer } from '@hooks';
import { DeliveryDetail } from 'src/types/delivery';
import getDeliveryTableConfig from '../delivery-table-config';
import { useDeliveriesContext } from 'src/contexts/deliveries/deliveries-context';
import useStaffData from 'src/hooks/use-staff-data';
import DeliveryFilter from './delivery-filter';
import DeliveryDetailEditDrawer from '../delivery-detail/delivery-detail-edit-drawer';
import DeliveryDetailDeleteDialog from '../delivery-detail/delivery-detail-delete-dialog';

function DeliveryList() {
  const router = useRouter();
  const { getDeliveriesApi } = useDeliveriesContext();
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const { deleteDelivery } = useDeliveriesContext();

  const deleteDeliveryDialog = useDialog<DeliveryDetail>();
  const editDeliveryDrawer = useDrawer<DeliveryDetail>();

  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: null,
    endDate: null
  });

  const staffs = useStaffData();
  const deliveries = useMemo(() => {
    return getDeliveriesApi.data || [];
  }, [getDeliveriesApi.data]);

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
    return getDeliveryTableConfig({
      onClickDelete: (data: DeliveryDetail) => {
        deleteDeliveryDialog.handleOpen(data);
      },
      onClickEdit: (data: DeliveryDetail) => {
        editDeliveryDrawer.handleOpen(data);
      },
      staffs: staffs.staffs
    });
  }, [staffs]);

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
      {/* <>{JSON.stringify(filteredDeliveries)}</> */}
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
      <DeliveryDetailDeleteDialog
        open={deleteDeliveryDialog.open}
        delivery={deleteDeliveryDialog.data as DeliveryDetail}
        onClose={deleteDeliveryDialog.handleClose}
        onConfirm={() => deleteDelivery(deleteDeliveryDialog.data?.id as string)}
      />
      <DeliveryDetailEditDrawer
        open={editDeliveryDrawer.open}
        delivery={editDeliveryDrawer.data as DeliveryDetail}
        onClose={editDeliveryDrawer.handleClose}
        staffs={staffs.users}
      />
    </Box>
  );
}

export default DeliveryList;
