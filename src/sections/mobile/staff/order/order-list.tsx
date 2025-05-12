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
  CircularProgress
} from '@mui/material';
import { Box, AddCircle } from 'iconsax-react';
import MobileContentHeader from 'src/components/mobile-content-header';
import { useRouter } from 'next/router';
import { paths } from 'src/paths';
import { SearchIcon } from 'lucide-react';
import OrderCard from './order-card';
import { useOrdersContext } from 'src/contexts/orders/orders-context';
import MobileAdvancedFilter from 'src/components/mobile-advanced-filter/mobile-advanced-filter';
import usePagination from 'src/hooks/use-pagination';
import { Filter } from 'src/types/filter';
import { formatUnixTimestamp } from 'src/utils/format-time-currency';
import { useAuth, useFirebaseAuth } from '@hooks';
import LoadingProcess from 'src/components/LoadingProcess';

function MobileOrderList() {
  const router = useRouter();
  const { user } = useAuth();
  const { user: firebaseUser } = useFirebaseAuth();
  const [searchInput, setSearchInput] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('Tất cả');
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null
  });
  const statusList = [
    'Tất cả',
    'Đã giao',
    'Đã hủy',
    'Đang giao',
    'Đã xác nhận',
    'Đang chờ xử lý',
    'Đã từ chối'
  ];
  const { getOrdersApi } = useOrdersContext();

  const handleDateChange = useCallback(
    (range: { startDate: Date | null; endDate: Date | null }) => {
      setDateRange(range);
    },
    []
  );

  const handleStatusChange = useCallback((status: string) => {
    setSelectedStatus(status);
  }, []);

  const filters: Filter[] = [
    {
      type: 'select',
      title: 'Trạng thái',
      value: selectedStatus,
      onChange: handleStatusChange,
      options: statusList.map((status) => ({
        label: status,
        value: status
      }))
    },
    {
      type: 'dateRange',
      title: 'Nhập thời gian giao đơn hàng',
      value: dateRange,
      onChange: handleDateChange
    }
  ];

  const handleGoAddOrder = useCallback(() => {
    router.push(paths.student.order.add);
  }, [router]);

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  }, []);

  const handlePaymentStatusChange = useCallback((event: SelectChangeEvent<string>) => {
    setPaymentStatus(event.target.value as string);
  }, []);

  const orders = useMemo(() => {
    return (getOrdersApi.data?.results || []).filter(
      (order) => order.shipperId === user?.id || order.shipperId === firebaseUser?.id
    );
  }, [getOrdersApi.data, user, firebaseUser]);

  const filteredOrders = useMemo(() => {
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
              ? order.latestStatus === 'CANCELED'
              : selectedStatus === 'Đang giao'
                ? order.latestStatus === 'IN_TRANSPORT'
                : selectedStatus === 'Đã xác nhận'
                  ? order.latestStatus === 'ACCEPTED'
                  : selectedStatus === 'Đang chờ xử lý'
                    ? order.latestStatus === 'PENDING'
                    : selectedStatus === 'Đã từ chối'
                      ? order.latestStatus === 'REJECTED'
                      : false;
      const orderDate = formatUnixTimestamp(order.deliveryDate);
      const filterDate =
        !dateRange.startDate || !dateRange.endDate
          ? true
          : dateRange.startDate && dateRange.endDate
            ? dateRange.startDate <= orderDate && orderDate <= dateRange.endDate
            : true;
      return filteredByPaid && filteredBySearch && filterStatus && filterDate;
    });
    return result;
  }, [orders, searchInput, paymentStatus, selectedStatus, dateRange]);

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
    <Stack className='min-h-screen py-4 px-3'>
      <MobileContentHeader
        title='Danh sách đơn hàng'
        image={<Box size={24} name='ShoppingCart' color='green' />}
        rightComponent={
          (user?.role === 'STUDENT' || firebaseUser?.role === 'STUDENT') && (
            <AddCircle
              size={40}
              variant='Bold'
              onClick={handleGoAddOrder}
              color='green'
              className='cursor-pointer'
            />
          )
        }
      />
      <Stack mt={1}>
        <TextField
          variant='outlined'
          placeholder='Tìm kiếm theo mã đơn hoặc sản phẩm'
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
          <MobileAdvancedFilter filters={filters} />
        </Stack>
      </Stack>
      <Stack mt={1.5} sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <Typography fontWeight={'bold'} color='black'>
          {filteredOrders.length} đơn hàng
        </Typography>
        {getOrdersApi.loading ? (
          <LoadingProcess />
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
