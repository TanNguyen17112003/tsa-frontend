import React, { useState, useMemo, useCallback, useEffect } from 'react';
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
import { Filter } from 'src/types/filter';
import { useAuth, useFirebaseAuth } from '@hooks';
import { OrderStatus, orderStatusMap } from 'src/types/order';
import Pagination from 'src/components/ui/Pagination';

function MobileOrderList() {
  const router = useRouter();
  const { user } = useAuth();
  const { user: firebaseUser } = useFirebaseAuth();
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('0');
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
  const { getOrdersApi, orderFilter, setOrderFilter, orderPagination } = useOrdersContext();

  const handleDateChange = useCallback(
    (range: { startDate: Date | null; endDate: Date | null }) => {
      setDateRange(range);
    },
    []
  );

  const handleStatusChange = useCallback((status: string) => {
    setSelectedStatus(orderStatusMap[status as keyof typeof orderStatusMap]);
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

  const handleSearch = useCallback(() => {
    setSearchQuery(searchInput);
  }, [searchInput]);

  const handlePaymentStatusChange = useCallback((event: SelectChangeEvent<string>) => {
    setPaymentStatus(event.target.value as string);
  }, []);

  const orders = useMemo(() => {
    return (getOrdersApi.data?.results || []).filter((order) => {
      if (user?.role === 'STUDENT' || firebaseUser?.role === 'STUDENT') {
        return true;
      } else {
        return order.shipperId === user?.id || order.shipperId === firebaseUser?.id;
      }
    });
  }, [getOrdersApi.data, user, firebaseUser]);

  const numberOfOrders = useMemo(() => {
    return getOrdersApi.data?.totalElements || 0;
  }, [getOrdersApi.data]);

  useEffect(() => {
    setOrderFilter({
      ...orderFilter,
      isPaid: paymentStatus === '1',
      status: selectedStatus !== 'Tất cả' ? (selectedStatus as OrderStatus) : undefined,
      dateRange,
      search: searchQuery,
      page: orderPagination.page + 1
    });
  }, [searchQuery, paymentStatus, selectedStatus, dateRange, orderPagination.page]);

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
              <InputAdornment position='end' className='cursor-pointer' onClick={handleSearch}>
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
          {numberOfOrders} đơn hàng
        </Typography>
        {getOrdersApi.loading ? (
          <Stack className='items-center justify-center h-[300px]'>
            <CircularProgress />
          </Stack>
        ) : (
          <Stack spacing={2} mt={1}>
            {orders.length === 0 && (
              <Stack className='items-center justify-center h-[300px]'>
                <Typography variant='h5' color='error'>
                  Không có đơn hàng nào
                </Typography>
              </Stack>
            )}
            {orders.map((order, index) => (
              <OrderCard key={index} order={order} />
            ))}
            <Pagination
              page={orderPagination.page}
              count={numberOfOrders}
              onChange={orderPagination.onPageChange}
              rowsPerPage={orderPagination.rowsPerPage}
            />
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}

export default MobileOrderList;
