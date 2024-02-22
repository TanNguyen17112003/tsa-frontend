import { useEffect, useState } from "react";
import { useAuth } from "src/hooks/use-auth";
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import DeletedComplaint from "src/sections/admin/complaints/khieu-nai-da-xoa";
import ComplaintManagement from "src/sections/admin/complaints/quan-ly-khieu-nai";
import type { Page as PageType } from "src/types/page";

const tabs = [
  {
    label: "Quản lý khiếu nại",
    key: "1",
  },
  {
    label: "Khiếu nại đã xóa",
    key: "2",
  },
];

const Page: PageType = () => {
  const [tab, setTab] = useState(tabs[0].key);
  return (
    <div className="divide-y-2">
      <div className="pt-8 px-8">
        <div className="text-2xl font-semibold">Quản lý khiếu nại</div>
        <div className="flex space-x-4 overflow-hidden mt-4">
          {tab == "1" ? (
            <div
              onClick={() => setTab("1")}
              className="text-nowrap text-orange-600 border-b border-orange-500 pb-5 cursor-pointer"
            >
              {tabs[0].label}
            </div>
          ) : (
            <div
              onClick={() => setTab("1")}
              className="text-nowrap cursor-pointer"
            >
              {tabs[0].label}
            </div>
          )}
          {tab == "2" ? (
            <div
              onClick={() => setTab("2")}
              className="text-nowrap text-orange-600 border-b border-orange-500 pb-5   cursor-pointer"
            >
              {tabs[1].label}
            </div>
          ) : (
            <div
              onClick={() => setTab("2")}
              className="text-nowrap cursor-pointer"
            >
              {tabs[1].label}
            </div>
          )}
        </div>
      </div>
      <div className="pt-8 px-8">
        {tab == "1" ? <ComplaintManagement /> : <DeletedComplaint />}
      </div>
    </div>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
