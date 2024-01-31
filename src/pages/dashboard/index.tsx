import { useEffect, useState } from "react";
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
  const [searchMode, setSearchMode] = useState("basic");
  const handleModeChange = (newMode: string) => {
    setSearchMode(newMode);
  };
  return (
    <div
      className="p-4 bg-cover bg-center h-screen"
      style={{ backgroundImage: 'url("/background.png")' }}
    >
      <div className="text-xl font-semibold bg-white my-4">
        Tổng quan hệ thống
      </div>
      <div className="flex bg-white h-15">
        <div className="flex items-center border border-orange-300 p-2 rounded-md w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M9 3.5C5.96243 3.5 3.5 5.96243 3.5 9C3.5 12.0376 5.96243 14.5 9 14.5C10.519 14.5 11.893 13.8852 12.8891 12.8891C13.8852 11.893 14.5 10.519 14.5 9C14.5 5.96243 12.0376 3.5 9 3.5ZM2 9C2 5.13401 5.13401 2 9 2C12.866 2 16 5.13401 16 9C16 10.6625 15.4197 12.1906 14.4517 13.3911L17.7803 16.7197C18.0732 17.0126 18.0732 17.4874 17.7803 17.7803C17.4874 18.0732 17.0126 18.0732 16.7197 17.7803L13.3911 14.4517C12.1906 15.4197 10.6625 16 9 16C5.13401 16 2 12.866 2 9Z"
              fill="#4B5563"
            />
          </svg>
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="outline-none w-full"
          />
          <div>
            <select
              value={searchMode}
              onChange={(e) => handleModeChange(e.target.value)}
              className="text-sm text-black-600 bg-white border border-orange-300 rounded-r-md px-2 py-1"
            >
              <option value="basic">Tìm kiếm cơ bản</option>
              <option value="advanced">Tìm kiếm nâng cao</option>
              <option value="adjacent">Tìm kiếm từ liền kề</option>
            </select>
          </div>
        </div>
        <button className="ml-2 bg-orange-500 text-white px-4 py-2 rounded-md">
          <div>Tìm_kiếm</div>
        </button>
      </div>
      <div
        className="flex p-4 bg-cover bg-center h-screen w-auto h-12"
        style={{ backgroundImage: 'url("/image_overview.png")' }}
      >
        <div>Bài kinh</div>
        <div>Tài khoản dịch giả</div>
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
    </div>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
