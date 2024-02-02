import { useEffect, useState } from "react";
import { useAuth } from "src/hooks/use-auth";
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import type { Page as PageType } from "src/types/page";
import CommonCard from "src/components/CommonCard";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { PiBookOpen } from "react-icons/pi";

const children = [
  { title: "Bài dịch số 23", time: "15:30 - 01/12/2023" },
  { title: "Bài dịch số 20", time: "15:30 - 01/12/2023" },
  { title: "Bài dịch số 21", time: "15:30 - 01/12/2023" },
  { title: "Bài dịch số 24", time: "15:30 - 01/12/2023" },
  { title: "Bài dịch số 26", time: "15:30 - 01/12/2023" },
];

const history = [
  { title: "Đọc bài kinh 1: Bài dịch số 2", time: "15:30 - 01/12/2023" },
  { title: "Tìm kiếm bài dịch số 62", time: "15:30 - 01/12/2023" },
  { title: "Đọc bài kinh 7: Bài dịch số 20", time: "15:30 - 01/12/2023" },
  { title: "Đọc bài kinh 3: Bài dịch số 21", time: "15:30 - 01/12/2023" },
  { title: "Tìm kiếm bài dịch số 62", time: "15:30 - 01/12/2023" },
  { title: "Đọc bài kinh 11: Bài dịch số 24", time: "15:30 - 01/12/2023" },
  { title: "Tìm kiếm bài dịch số 62", time: "15:30 - 01/12/2023" },
  { title: "Đọc bài kinh 5: Bài dịch số 26", time: "15:30 - 01/12/2023" },
];

const Page: PageType = () => {
  const [searchMode, setSearchMode] = useState("basic");
  const handleModeChange = (newMode: string) => {
    setSearchMode(newMode);
  };
  return (
    <div
      className="flex p-6 bg-cover bg-center h-screen"
      style={{ backgroundImage: 'url("/background.png")' }}
    >
      <div className="w-full">
        <div className="text-2xl font-semibold bg-white my-4">
          Tổng quan hệ thống
        </div>
        <div className="flex bg-white h-15 pr-auto">
          <div className="flex p-2 items-center border border-gray-300 rounded-md h-12 w-full">
            <div className="flex">
              <HiMagnifyingGlass
                style={{ fontSize: "2rem", marginRight: "5px" }}
              />
              <input
                type="text"
                placeholder="Nhập từ khóa tìm kiếm..."
                className="outline-none w-full text-sm/normal"
              />
            </div>
            <div className="border-l-2 h-full relative">
              <select
                value={searchMode}
                onChange={(e) => handleModeChange(e.target.value)}
                className="text-md text-black-600 bg-white m-2"
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
          className="flex p-4 bg-cover bg-center w-auto h-auto"
          style={{ backgroundImage: 'url("/image_overview.png")' }}
        >
          <div>Bài kinh</div>
          <div>Tài khoản dịch giả</div>
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div className="w-">AAA</div>
          <CommonCard
            link="/dashboard"
            linkLabel="Xem tất cả"
            title="Bài dịch mới nhất"
          >
            {children.map((c, index) => (
              <div className="pb-4" key={c.title}>
                <PiBookOpen style={{ fontSize: "1.4em" }} />
                <div key={index} className="text-black-700">
                  {c.title}
                </div>
                <div key={index} className="text-gray-500 text-xs">
                  {c.time}
                </div>
              </div>
            ))}
          </CommonCard>
        </div>
      </div>
      <div className="p-4 border border-gray-300 rounded-3xl bg-white w-auto h-auto ml-3 divide-y-2 min-w-96">
        <div className="mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 6V12H16.5M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
              stroke="black"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <h2 className="font-semibold">Lịch sử hoạt động hệ thống</h2>
        </div>
        <div className="space-y-8">
          <div className="mt-4"></div>
          {history.map((h) => (
            <div key={h.title}>
              <div className="text-cyan-500">{h.title}</div>
              <div className="text-gray-500 text-xs">{h.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
