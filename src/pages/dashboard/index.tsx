import { useEffect, useState } from "react";
import { useAuth } from "src/hooks/use-auth";
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import type { Page as PageType } from "src/types/page";
import CommonCard from "src/components/CommonCard";
import { HiMagnifyingGlass, HiMiniArrowSmallRight } from "react-icons/hi2";
import { PiBookOpen } from "react-icons/pi";
import { BookshelfIcon } from "src/components/icons/BookshelfIcon";
import { LuClock } from "react-icons/lu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/shadcn/ui/select";
import { Button } from "src/components/shadcn/ui/button";
import { Input } from "src/components/shadcn/ui/input";
import OverviewAdminPage from "src/sections/admin/dashboard/OverviewAdminPage";
import OverviewUserPage from "src/sections/user/dashboard/OverviewUserPage";

const Page: PageType = () => {
  const user: string = "user";
  return (
    <div>{user == "admin" ? <OverviewAdminPage /> : <OverviewUserPage />}</div>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
