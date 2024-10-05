import { ArrowBack } from '@mui/icons-material';
import { Box, Divider, Tab, Tabs, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { paths } from 'src/paths';
import type { Page as PageType } from 'src/types/page';
import OrderInfoCard from 'src/sections/admin/order/order-detail/order-info-card';
import { useOrdersContext } from 'src/contexts/orders/orders-context';
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
  const { getOrdersApi } = useOrdersContext();
  const order = useMemo(() => {
    return (getOrdersApi.data || []).find((order) => order.id === router.query.orderId);
  }, [getOrdersApi.data]);
  const [tab, setTab] = useState(tabs[0].key);

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
                router.push(paths.dashboard.order.index);
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

        <OrderInfoCard order={initialOrderList[0] || order!} />
      </Stack>
    </Box>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
