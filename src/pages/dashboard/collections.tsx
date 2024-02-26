import { useEffect } from "react";
import { useAuth } from "src/hooks/use-auth";
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import PageHeader from "src/components/PageHeader";
import type { Page as PageType } from "src/types/page";

const Page: PageType = () => {
  return <></>;
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
