import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ReportsProvider from "src/contexts/reports/reports-context";
import { useAuth } from "src/hooks/use-auth";
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import DeletedReport from "src/sections/admin/reports/DeletedReportTab";
import ReportManagement from "src/sections/admin/reports/ReportManagementTab";
import type { Page as PageType } from "src/types/page";

const tabs = [
  {
    label: "Quản lý khiếu nại",
    key: "handle-report",
  },
  {
    label: "Khiếu nại đã xóa",
    key: "deleted-report",
  },
];

const Page: PageType = () => {
  const [tab, setTab] = useState(tabs[0].key);

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.role == "user") {
      router.push("/dashboard");
    }
  }, []);

  return (
    <div className="divide-y-2">
      {user?.role != "user" && (
        <>
          <div className="pt-8 px-8">
            <div className="text-2xl font-semibold">Quản lý khiếu nại</div>
            <div className="flex space-x-4 overflow-hidden mt-4">
              {tab == "handle-report" ? (
                <div
                  onClick={() => setTab("handle-report")}
                  className="text-nowrap text-orange-600 border-b border-orange-500 pb-5 cursor-pointer"
                >
                  {tabs[0].label}
                </div>
              ) : (
                <div
                  onClick={() => setTab("handle-report")}
                  className="text-nowrap cursor-pointer"
                >
                  {tabs[0].label}
                </div>
              )}
              {tab == "deleted-report" ? (
                <div
                  onClick={() => setTab("deleted-report")}
                  className="text-nowrap text-orange-600 border-b border-orange-500 pb-5   cursor-pointer"
                >
                  {tabs[1].label}
                </div>
              ) : (
                <div
                  onClick={() => setTab("deleted-report")}
                  className="text-nowrap cursor-pointer"
                >
                  {tabs[1].label}
                </div>
              )}
            </div>
          </div>
          <div>
            {tab == "handle-report" ? <ReportManagement /> : <DeletedReport />}
          </div>
        </>
      )}
    </div>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    <ReportsProvider>{page}</ReportsProvider>
  </DashboardLayout>
);

export default Page;
