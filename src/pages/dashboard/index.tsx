import { useAuth } from 'src/hooks/use-auth';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import OverviewAdminPage from 'src/sections/admin/dashboard/OverviewAdminPage';
import OverviewUserPage from 'src/sections/user/dashboard/OverviewUserPage';
import type { Page as PageType } from 'src/types/page';

const Page: PageType = () => {
  const { user } = useAuth();
  return <div>{user?.role == 'admin' ? <OverviewAdminPage /> : <OverviewUserPage />}</div>;
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
