import { useEffect } from "react";
import PageHeader from "src/components/PageHeader";
import { useAuth } from "src/hooks/use-auth";
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import Collection from "src/modules/Collection";
import type { Page as PageType } from "src/types/page";

const Page: PageType = () => {
  return (
    <>
      <PageHeader title="Kho dữ liệu" />
      <Collection></Collection>
    </>
  );
};

export default Page;
