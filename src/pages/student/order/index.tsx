import { Box, Button, Tab, Tabs } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import type { Page as PageType } from 'src/types/page';
import { Add } from '@mui/icons-material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { paths } from 'src/paths';
import Link from 'next/link';
import { Stack } from '@mui/system';
import ContentHeader from 'src/components/content-header';
import OrderNotPaid from 'src/sections/student/order/order-list/order-not-paid';
import OrderPaid from 'src/sections/student/order/order-list/order-paid';
import { useRouter } from 'next/router';
import OrderDetailPage from './[orderId]';
import OrdersProvider from 'src/contexts/orders/orders-context';
import { useOrdersContext } from 'src/contexts/orders/orders-context';
import { useAuth, useDialog, useFirebaseAuth } from '@hooks';
import useFunction from 'src/hooks/use-function';
import MobileOrderList from 'src/sections/mobile/student/order/order-list';
import MobileOrderDetail from 'src/sections/mobile/student/order/order-detail';
import UpdateInformationDialog, { InformationProps } from '../update-information-dialog';
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
  const updateInformationDialog = useDialog();
  const { isMobile } = useResponsive();
  const { user: firebaseUser, updateProfile } = useFirebaseAuth();

  useEffect(() => {
    if (
      firebaseUser &&
      !firebaseUser.dormitory &&
      !firebaseUser.room &&
      !firebaseUser.building &&
      !firebaseUser.phoneNumber
    ) {
      updateInformationDialog.handleOpen();
    }
  }, [firebaseUser]);

  const handleUpdateInformation = useCallback(
    async (data: InformationProps) => {
      try {
        await updateProfile?.({
          dormitory: data.dormitory,
          building: data.building,
          room: data.room,
          phoneNumber: data.phoneNumber
        });
      } catch (error) {
        throw error;
      }
    },
    [firebaseUser, updateProfile]
  );

  const handleUpdateInformationHelper = useFunction(handleUpdateInformation, {
    successMessage: 'Cập nhật thông tin thành công!'
  });
  const [tab, setTab] = useState(tabs[0].key);
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
          {tab === tabs[0].key && <OrderPaid orders={paidOrders} loading={getOrdersApi.loading} />}
          {tab === tabs[1].key && (
            <OrderNotPaid orders={notPaidOrders} loading={getOrdersApi.loading} />
          )}
        </Stack>
      )}
      <UpdateInformationDialog
        open={updateInformationDialog.open}
        onClose={updateInformationDialog.handleClose}
        onSubmit={handleUpdateInformationHelper.call}
      />
    </Box>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    <OrdersProvider>{page}</OrdersProvider>
  </DashboardLayout>
);

export default Page;
