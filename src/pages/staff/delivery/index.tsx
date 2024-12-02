import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import type { Page as PageType } from 'src/types/page';
import { Stack } from '@mui/system';
import ContentHeader from 'src/components/content-header';
import { useResponsive } from 'src/utils/use-responsive';
import DeliverList from 'src/sections/staff/delivery/delivery-list';
import DeliveriesProvider from 'src/contexts/deliveries/deliveries-context';
import MobileDeliveryList from 'src/sections/mobile/staff/delivery/delivery-list';
import { useAuth, useFirebaseAuth } from '@hooks';
const Page: PageType = () => {
  const { isMobile } = useResponsive();
  const { user } = useAuth();
  const { user: firebaseUser } = useFirebaseAuth();
  return (
    <>
      {isMobile ? (
        <MobileDeliveryList />
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
            title={
              user?.role === 'ADMIN' || firebaseUser?.role === 'ADMIN'
                ? 'Quản lý chuyến đi'
                : 'Thông tin chuyến đi'
            }
            description={
              user?.role === 'STAFF' || firebaseUser?.role === 'STAFF'
                ? 'Danh sách chuyến đi bạn phụ trách'
                : 'Quản lý chuyến đi hệ thống'
            }
          />
          <DeliverList />
        </Stack>
      )}
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    <DeliveriesProvider>{page}</DeliveriesProvider>
  </DashboardLayout>
);

export default Page;
