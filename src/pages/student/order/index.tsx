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
  const [tab, setTab] = useState(tabs[0].key);
  const router = useRouter();
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
            title='Thông tin đơn hàng'
            description='Danh sách đơn hàng của bạn'
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
                  Thêm đơn hàng
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
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
