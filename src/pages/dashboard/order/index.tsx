import { Box, Button } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import type { Page as PageType } from 'src/types/page';
import { Add } from '@mui/icons-material';
import { useEffect, useMemo, useState } from 'react';
import { paths } from 'src/paths';
import Link from 'next/link';
import { Stack } from '@mui/system';
import ContentHeader from 'src/components/content-header';
import { useRouter } from 'next/router';
import OrderDetailPage from './[orderId]';
import OrdersProvider from 'src/contexts/orders/orders-context';
import { useOrdersContext } from 'src/contexts/orders/orders-context';
import { useAuth } from '@hooks';
import OrderList from 'src/sections/admin/order/order-list';

const Page: PageType = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { getOrdersApi } = useOrdersContext();
  const orders = useMemo(() => {
    return getOrdersApi.data || [];
  }, [getOrdersApi.data]);

  const notPaidOrders = useMemo(() => {
    return orders.filter((order) => !order.isPaid);
  }, [orders]);
  const paidOrders = useMemo(() => {
    return orders.filter((order) => order.isPaid);
  }, [orders]);
  return (
    <>
      {router.query.orderId ? (
        <OrderDetailPage />
      ) : (
        <Stack
          sx={{
            maxHeight: '100vh',
            overflow: 'auto',
            bgcolor: 'white'
          }}
          className='min-h-screen'
        >
          <ContentHeader
            title='Quản lý đơn hàng'
            rightSection={
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  alignItems: 'center'
                }}
              >
                <Button
                  variant='contained'
                  color='success'
                  startIcon={<Add />}
                  LinkComponent={Link}
                  href={paths.student.order.add}
                >
                  Thêm
                </Button>
              </Box>
            }
          />
          <OrderList />
        </Stack>
      )}
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    <OrdersProvider>{page}</OrdersProvider>
  </DashboardLayout>
);

export default Page;
