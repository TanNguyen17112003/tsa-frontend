import { useEffect } from "react";
import { useAuth } from "src/hooks/use-auth";
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import Collection from "src/modules/Collection";
import type { Page as PageType } from "src/types/page";

const Page: PageType = () => {
  return <Collection></Collection>;
};

export default Page;
