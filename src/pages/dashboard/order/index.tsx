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
import OrderList from 'src/sections/admin/order/order-list';
import MobileOrderList from 'src/sections/mobile/admin/order/order-list';
import { useResponsive } from 'src/utils/use-responsive';

const Page: PageType = () => {
  const router = useRouter();
  const { isMobile } = useResponsive();
  return (
    <>
      {router.query.orderId ? (
        <OrderDetailPage />
      ) : isMobile ? (
        <MobileOrderList />
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
                  href={paths.dashboard.order.add}
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
