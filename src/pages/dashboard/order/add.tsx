import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import type { Page as PageType } from 'src/types/page';
import OrdersProvider from 'src/contexts/orders/orders-context';
import OrderAddPage from 'src/sections/admin/order/order-add/order-add-page';

const Page: PageType = () => {
  return <OrderAddPage />;
};

Page.getLayout = (page) => (
  <DashboardLayout>
    <OrdersProvider>{page}</OrdersProvider>
  </DashboardLayout>
);

export default Page;
