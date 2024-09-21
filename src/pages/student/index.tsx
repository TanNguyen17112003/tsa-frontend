import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { paths } from 'src/paths';
import type { Page as PageType } from 'src/types/page';
import StudentOrderPage from 'src/pages/student/order/index';
import OrdersProvider from 'src/contexts/orders/orders-context';

const Page: PageType = () => {
  return <StudentOrderPage />;
};

Page.getLayout = (page) => (
  <DashboardLayout>
    <OrdersProvider>{page}</OrdersProvider>
  </DashboardLayout>
);

export default Page;
