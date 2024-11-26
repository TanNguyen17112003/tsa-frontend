import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import type { Page as PageType } from 'src/types/page';
import { Stack } from '@mui/system';
import ContentHeader from 'src/components/content-header';
import { useResponsive } from 'src/utils/use-responsive';
import DeliverList from 'src/sections/admin/delivery/delivery-list';
import DeliveriesProvider from 'src/contexts/deliveries/deliveries-context';
import MobileDeliveryList from 'src/sections/mobile/admin/delivery/delivery-list';
const Page: PageType = () => {
  const { isMobile } = useResponsive();
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
          <ContentHeader title='Quản lý chuyến đi' />
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
