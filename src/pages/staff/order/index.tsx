import { Box, Button, Tab, Tabs } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import type { Page as PageType } from 'src/types/page';
import { Add } from '@mui/icons-material';
import { useState } from 'react';
import { paths } from 'src/paths';
import Link from 'next/link';
import { Stack } from '@mui/system';
import ContentHeader from 'src/components/content-header';
import OrderNotPaid from 'src/sections/student/order/order-list/order-not-paid';
import OrderPaid from 'src/sections/student/order/order-list/order-paid';
import { useRouter } from 'next/router';
import OrderDetailPage from './[orderId]';
import OrdersProvider from 'src/contexts/orders/orders-context';
import MobileOrderList from 'src/sections/mobile/staff/order/order-list';
import { useResponsive } from 'src/utils/use-responsive';

const tabs = [
  {
    label: 'Đã thanh toán',
    key: 'Đã thanh toán'
  },
  {
    label: 'Chưa thanh toán',
    key: 'Chưa thanh toán'
  }
];

const Page: PageType = () => {
  const { isMobile } = useResponsive();
  const [tab, setTab] = useState(tabs[0].key);
  const router = useRouter();

  return (
    <Box className='bg-white'>
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
            title='Thông tin đơn hàng'
            description='Danh sách đơn hàng bạn phụ trách'
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
            tabs={
              <Tabs
                value={tab}
                onChange={(_, value) => setTab(value)}
                sx={{
                  '& .MuiTabs-indicator': {
                    backgroundColor: 'green'
                  },
                  '& .MuiTab-root': {
                    color: 'green',
                    '&.Mui-selected': {
                      color: 'green'
                    }
                  }
                }}
              >
                {tabs.map((tab) => (
                  <Tab key={tab.key} label={tab.label} value={tab.key} />
                ))}
              </Tabs>
            }
          />
          {tab === tabs[0].key && <OrderPaid />}
          {tab === tabs[1].key && <OrderNotPaid />}
        </Stack>
      )}
    </Box>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    <OrdersProvider>{page}</OrdersProvider>
  </DashboardLayout>
);

export default Page;
