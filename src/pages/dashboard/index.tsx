import { useEffect } from "react";
import { useAuth } from "src/hooks/use-auth";
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import type { Page as PageType } from "src/types/page";
import { CommonCard } from "src/components/CommonCard";

const children = [
  { title: "Bài dịch số 23", time: "15:30 - 01/12/2023" },
  { title: "Bài dịch số 20", time: "15:30 - 01/12/2023" },
  { title: "Bài dịch số 21", time: "15:30 - 01/12/2023" },
  { title: "Bài dịch số 24", time: "15:30 - 01/12/2023" },
  { title: "Bài dịch số 26", time: "15:30 - 01/12/2023" },
];

const Page: PageType = () => {
  return (
    <>
      <div>Tổng quan hệ thống</div>
      <div className="flex items-center border border-gray-300 p-2 rounded-md">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="outline-none w-full"
        />
        <button className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md">
          Tìm
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div>AAA</div>
        <CommonCard
          children={children}
          link=""
          linkLabel="/dasboard"
          title="Bài dịch mới nhất"
        />
      </div>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
