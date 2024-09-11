import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { paths } from 'src/paths';
import type { Page as PageType } from 'src/types/page';
import StudentOrPage from 'src/pages/student/order/index';

const Page: PageType = () => {
  return <StudentOrPage />;
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
