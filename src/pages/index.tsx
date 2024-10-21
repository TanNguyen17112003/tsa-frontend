import { useRouter } from 'next/router';
// import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import type { Page as PageType } from 'src/types/page';

const Page: PageType = () => {
  const router = useRouter();
  router.replace('/landing');
  return <></>;
};

// Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
