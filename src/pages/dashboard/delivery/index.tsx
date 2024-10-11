import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import type { Page as PageType } from 'src/types/page';
import { Stack } from '@mui/system';
import ContentHeader from 'src/components/content-header';
import { useRouter } from 'next/router';
import { useAuth } from '@hooks';
import DeliverList from 'src/sections/admin/delivery/deliveryList';
import DeliveriesProvider from 'src/contexts/deliveries/deliveries-context';
const Page: PageType = () => {
  const { user } = useAuth();
  const router = useRouter();
  return (
    <>
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
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    <DeliveriesProvider>{page}</DeliveriesProvider>
  </DashboardLayout>
);

export default Page;
