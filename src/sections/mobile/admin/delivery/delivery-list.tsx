import React, { useCallback, useMemo, useState, useEffect } from 'react';
import {
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
  FormControl,
  Pagination,
  CircularProgress,
  Button
} from '@mui/material';
import { Box, AddCircle, Filter, ArrowRotateLeft } from 'iconsax-react';
import MobileContentHeader from 'src/components/mobile-content-header';
import { useRouter } from 'next/router';
import { paths } from 'src/paths';
import { SearchIcon } from 'lucide-react';
import DeliveryCard from './delivery-card';
import { useDeliveriesContext } from 'src/contexts/deliveries/deliveries-context';
import usePagination from 'src/hooks/use-pagination';
import { formatUnixTimestamp } from 'src/utils/format-time-currency';
import { useDialog } from '@hooks';
import DeliveryFilter from './delivery-filter/delivery-filter';
import { PiMotorcycle } from 'react-icons/pi';

function MobileDeliveryList() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null
  });
  const [loading, setLoading] = useState(true);

  const { getDeliveriesApi } = useDeliveriesContext();

  const handleDateChange = useCallback((range: { startDate?: Date; endDate?: Date }) => {
    setDateRange({
      startDate: range.startDate || null,
      endDate: range.endDate || null
    });
  }, []);

  const handleStatusChange = useCallback((status: string) => {
    setSelectedStatus(status);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSelectedStatus('all');
    setDateRange({ startDate: null, endDate: null });
  }, []);

  const deliveries = useMemo(() => {
    return getDeliveriesApi.data || [];
  }, [getDeliveriesApi.data]);

  const filtereddeliveries = useMemo(() => {
    setLoading(true);
    const result = deliveries.filter((delivery) => {
      const filterStatus =
        selectedStatus === 'all'
          ? true
          : selectedStatus === delivery.DeliveryStatusHistory[0].status;
      const deliveryDate = formatUnixTimestamp(delivery.createdAt);
      const filterDate =
        !dateRange.startDate || !dateRange.endDate
          ? true
          : dateRange.startDate && dateRange.endDate
            ? dateRange.startDate <= deliveryDate && deliveryDate <= dateRange.endDate
            : true;
      return filterStatus && filterDate;
    });
    setLoading(false);
    return result;
  }, [deliveries, selectedStatus, dateRange]);

  const pagination = usePagination({
    count: filtereddeliveries.length,
    initialRowsPerPage: 5
  });

  useEffect(() => {
    pagination.onPageChange(null, 1);
  }, [filtereddeliveries.length]);

  const paginateddeliveries = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.rowsPerPage;
    const endIndex = startIndex + pagination.rowsPerPage;
    return filtereddeliveries.slice(startIndex, endIndex);
  }, [filtereddeliveries, pagination.page, pagination.rowsPerPage]);

  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, page: number) => {
      pagination.onPageChange(null, page);
    },
    [pagination]
  );

  return (
    <Stack className='min-h-screen bg-white py-4 px-3'>
      <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
        <MobileContentHeader
          title={'Danh sách chuyến đi'}
          image={<PiMotorcycle size={24} color='green' />}
        />
        <DeliveryFilter
          selectedStatus={selectedStatus}
          dateRange={dateRange}
          onDateChange={handleDateChange}
          onStatusChange={(event: SelectChangeEvent<string>) =>
            handleStatusChange(event.target.value)
          }
          onResetFilters={handleResetFilters}
          numberOfDeliveries={filtereddeliveries.length}
        />
      </Stack>

      <Stack mt={1.5} sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <Typography fontWeight={'bold'} color='black'>
          {filtereddeliveries.length} chuyến đi
        </Typography>
        {loading ? (
          <Stack className='items-center justify-center h-[300px]'>
            <CircularProgress />
          </Stack>
        ) : (
          <Stack spacing={1.5} mt={1}>
            {paginateddeliveries.length === 0 && (
              <Stack className='items-center justify-center h-[300px]'>
                <Typography variant='h5' color='error'>
                  Không có chuyến đi nào
                </Typography>
              </Stack>
            )}
            {paginateddeliveries.map((delivery, index) => (
              <DeliveryCard key={index} delivery={delivery} />
            ))}
          </Stack>
        )}
        <Pagination
          count={Math.ceil(filtereddeliveries.length / pagination.rowsPerPage)}
          page={pagination.page}
          onChange={handlePageChange}
          color='primary'
          shape='rounded'
          size='small'
          className='self-center mt-2'
        />
      </Stack>
    </Stack>
  );
}

export default MobileDeliveryList;
