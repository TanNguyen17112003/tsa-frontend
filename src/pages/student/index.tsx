import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import type { Page as PageType } from 'src/types/page';
import StudentOrderPage from 'src/pages/student/order/index';
import OrdersProvider from 'src/contexts/orders/orders-context';
import React from 'react';

const Page: PageType = () => {
  return (
    <>
      <StudentOrderPage />
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    <OrdersProvider>{page}</OrdersProvider>
  </DashboardLayout>
);

export default Page;
