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
import OrderCard from './order-card';
import { useOrdersContext } from 'src/contexts/orders/orders-context';
import usePagination from 'src/hooks/use-pagination';
import { Filter as FilterType } from 'src/types/filter';
import { formatUnixTimestamp } from 'src/utils/format-time-currency';
import { useDialog } from '@hooks';
import OrderFilter from './order-filter/order-filter';

function MobileOrderList() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('Tất cả');
  const [selectedDormitory, setSelectedDormitory] = useState<string>('');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('');
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null
  });
  const [loading, setLoading] = useState(true);
  const { getOrdersApi } = useOrdersContext();

  const handleDateChange = useCallback((range: { startDate?: Date; endDate?: Date }) => {
    setDateRange({
      startDate: range.startDate || null,
      endDate: range.endDate || null
    });
  }, []);

  const handleStatusChange = useCallback((status: string) => {
    setSelectedStatus(status);
  }, []);

  const handleDormitoryChange = useCallback((event: SelectChangeEvent<string>) => {
    setSelectedDormitory(event.target.value);
    setSelectedBuilding('');
    setSelectedRoom('');
  }, []);

  const handleBuildingChange = useCallback((event: SelectChangeEvent<string>) => {
    setSelectedBuilding(event.target.value);
    setSelectedRoom('');
  }, []);

  const handleRoomChange = useCallback((event: SelectChangeEvent<string>) => {
    setSelectedRoom(event.target.value);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSelectedStatus('Tất cả');
    setSelectedDormitory('');
    setSelectedBuilding('');
    setSelectedRoom('');
    setDateRange({ startDate: null, endDate: null });
  }, []);

  const handleGoAddOrder = useCallback(() => {
    router.push(paths.dashboard.order.add);
  }, [router]);

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  }, []);

  const handlePaymentStatusChange = useCallback((event: SelectChangeEvent<string>) => {
    setPaymentStatus(event.target.value as string);
  }, []);

  const orders = useMemo(() => {
    return getOrdersApi.data?.results || [];
  }, [getOrdersApi.data]);

  const filteredOrders = useMemo(() => {
    setLoading(true);
    const result = orders.filter((order) => {
      const filteredByPaid =
        paymentStatus === '0' ? !order.isPaid : paymentStatus === '1' ? order.isPaid : true;
      const filteredBySearch = order.checkCode.toLowerCase().includes(searchInput.toLowerCase());
      const filterStatus =
        selectedStatus === 'Tất cả'
          ? true
          : selectedStatus === 'Đã giao'
            ? order.latestStatus === 'DELIVERED'
            : selectedStatus === 'Đã hủy'
              ? order.latestStatus === 'CANCELLED'
              : selectedStatus === 'Đang giao'
                ? order.latestStatus === 'IN_TRANSPORT'
                : selectedStatus === 'Đã xác nhận'
                  ? order.latestStatus === 'ACCEPTED'
                  : selectedStatus === 'Đang chờ xử lý'
                    ? order.latestStatus === 'PENDING'
                    : selectedStatus === 'Đã từ chối'
                      ? order.latestStatus === 'REJECTED'
                      : false;
      const filterDormitory = selectedDormitory ? order.dormitory === selectedDormitory : true;
      const filterBuilding = selectedBuilding ? order.building === selectedBuilding : true;
      const filterRoom = selectedRoom ? order.room === selectedRoom : true;
      const orderDate = formatUnixTimestamp(order.deliveryDate);
      const filterDate =
        !dateRange.startDate || !dateRange.endDate
          ? true
          : dateRange.startDate && dateRange.endDate
            ? dateRange.startDate <= orderDate && orderDate <= dateRange.endDate
            : true;
      return (
        filteredByPaid &&
        filteredBySearch &&
        filterStatus &&
        filterDormitory &&
        filterBuilding &&
        filterRoom &&
        filterDate
      );
    });
    setLoading(false);
    return result;
  }, [
    orders,
    searchInput,
    paymentStatus,
    selectedStatus,
    selectedDormitory,
    selectedBuilding,
    selectedRoom,
    dateRange
  ]);

  const pagination = usePagination({
    count: filteredOrders.length,
    initialRowsPerPage: 5
  });

  useEffect(() => {
    pagination.onPageChange(null, 1);
  }, [filteredOrders.length]);

  const paginatedOrders = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.rowsPerPage;
    const endIndex = startIndex + pagination.rowsPerPage;
    return filteredOrders.slice(startIndex, endIndex);
  }, [filteredOrders, pagination.page, pagination.rowsPerPage]);

  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, page: number) => {
      pagination.onPageChange(null, page);
    },
    [pagination]
  );

  return (
    <Stack className='min-h-screen py-4 px-3 bg-white'>
      <MobileContentHeader
        title={'Danh sách đơn hàng'}
        image={<Box size={24} name={'ShoppingCart'} color='green' />}
        rightComponent={
          <AddCircle
            size={40}
            variant='Bold'
            onClick={handleGoAddOrder}
            color='green'
            className='cursor-pointer'
          />
        }
      />
      <Stack mt={1}>
        <TextField
          variant='outlined'
          placeholder='Tìm kiếm theo mã đơn'
          value={searchInput}
          onChange={handleSearchChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end' className='cursor-pointer' onClick={() => {}}>
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
        <Stack direction='row' alignItems={'center'} mt={2} gap={1}>
          <FormControl className='w-[80%]' variant='filled'>
            <InputLabel>Trạng thái thanh toán</InputLabel>
            <Select
              value={paymentStatus}
              onChange={handlePaymentStatusChange}
              label='Trạng thái thanh toán'
            >
              <MenuItem value={'0'}>Chưa thanh toán</MenuItem>
              <MenuItem value={'1'}>Đã thanh toán</MenuItem>
            </Select>
          </FormControl>
          <OrderFilter
            selectedDormitory={selectedDormitory}
            selectedBuilding={selectedBuilding}
            selectedRoom={selectedRoom}
            selectedStatus={selectedStatus}
            dateRange={dateRange}
            onDormitoryChange={handleDormitoryChange}
            onBuildingChange={handleBuildingChange}
            onRoomChange={handleRoomChange}
            onDateChange={handleDateChange}
            onStatusChange={(event: SelectChangeEvent<string>) =>
              handleStatusChange(event.target.value)
            }
            onResetFilters={handleResetFilters}
            numberOfOrders={filteredOrders.length}
          />
        </Stack>
      </Stack>
      <Stack mt={1.5} sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <Typography fontWeight={'bold'} color='black'>
          {filteredOrders.length} đơn hàng
        </Typography>
        {loading ? (
          <Stack className='items-center justify-center h-[300px]'>
            <CircularProgress />
          </Stack>
        ) : (
          <Stack spacing={1.5} mt={1}>
            {paginatedOrders.length === 0 && (
              <Stack className='items-center justify-center h-[300px]'>
                <Typography variant='h5' color='error'>
                  Không có đơn hàng nào
                </Typography>
              </Stack>
            )}
            {paginatedOrders.map((order, index) => (
              <OrderCard key={index} order={order} />
            ))}
          </Stack>
        )}
        <Pagination
          count={Math.ceil(filteredOrders.length / pagination.rowsPerPage)}
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

export default MobileOrderList;
