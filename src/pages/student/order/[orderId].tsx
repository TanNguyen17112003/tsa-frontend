import { ArrowBack } from '@mui/icons-material';
import { Box, Button, Divider, Tab, Tabs, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from 'src/hooks/use-auth';
import useFunction from 'src/hooks/use-function';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { paths } from 'src/paths';
import type { Page as PageType } from 'src/types/page';
import { getFormData } from 'src/utils/api-request';
import OrderInfoCard from 'src/sections/student/order/order-detail/order-info-card';
import OrderDeliveryHistory from 'src/sections/student/order/order-detail/order-delivery-history';
import { initialOrderList } from 'src/types/order';

const tabs = [
  {
    label: 'Thông tin chung',
    key: 'Thông tin chung'
  },
  {
    label: 'Lịch sử giao hàng',
    key: 'Danh sách tham gia'
  }
];

const Page: PageType = () => {
  const router = useRouter();
  const [tab, setTab] = useState(tabs[0].key);
  const [status, setStatus] = useState<boolean>(true);
  const { user } = useAuth();

  const order = useMemo(() => {
    return initialOrderList.find((order) => order.id === router.query.orderId);
  }, [initialOrderList, router.query.orderId]);

  return (
    <Box
      sx={{
        maxWidth: 'xl',
        minHeight: '100vh',
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
        py: 3,
        px: 2,
        color: 'black',
        bgcolor: 'white'
      }}
    >
      <Stack spacing={4}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start'
          }}
        >
          <Box
            sx={{
              width: '100%'
            }}
          >
            <Box
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                router.push(paths.student.order.index);
              }}
            >
              <ArrowBack
                fontSize='small'
                sx={{
                  verticalAlign: 'middle'
                }}
              />{' '}
              Quay lại
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                justifyContent: 'space-between',
                width: '100%',
                mt: 3
              }}
            >
              <Typography variant='h5'>Chi tiết đơn hàng #{router.query.orderId}</Typography>
            </Box>
          </Box>
        </Box>

        <Box>
          <Tabs
            indicatorColor='primary'
            textColor='primary'
            value={tab}
            onChange={(_, value) => setTab(value)}
          >
            {tabs.map((tab) => (
              <Tab key={tab.key} label={tab.label} value={tab.key} />
            ))}
          </Tabs>
          <Divider></Divider>
        </Box>

        <>
          {tab === tabs[0].key && <OrderInfoCard order={order!} />}
          {tab === tabs[1].key && <OrderDeliveryHistory />}
        </>
      </Stack>
    </Box>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
