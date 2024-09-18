import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import type { Page as PageType } from 'src/types/page';
import OrderAddPage from 'src/sections/student/order/order-add/order-add-page';

const Page: PageType = () => {
  return <OrderAddPage />;
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
