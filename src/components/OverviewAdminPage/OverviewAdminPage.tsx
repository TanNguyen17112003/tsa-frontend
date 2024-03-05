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
import { BsPersonCircle } from "react-icons/bs";

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

const OverviewAdminPage = () => {
  const [searchMode, setSearchMode] = useState("basic");
  const handleModeChange = (newMode: string) => {
    setSearchMode(newMode);
  };
  return (
    <div
      className="flex bg-cover bg-center min-h-screen"
      style={{
        backgroundImage: 'url("/background.png")',
        width: "calc(100vw - 600px)",
      }}
    >
      <div className="flex-1 w-full p-6">
        <div className="text-2xl font-semibold leading-relaxed">
          Tổng quan hệ thống
        </div>
        <div className="flex bg-white h-15 my-5 ">
          <div className="flex p-2 items-center border border-gray-300 rounded-md h-12 w-full divide-x-2">
            <div className="flex w-full items-center">
              <HiMagnifyingGlass style={{ fontSize: "1.5rem" }} />
              <Input
                type="text"
                placeholder="Nhập từ khóa tìm kiếm..."
                className="border-none outline-none w-full text-sm/normal"
              />
            </div>
            <div className="items-center">
              <Select>
                <SelectTrigger className="w-[180px] f-full border-none">
                  <SelectValue placeholder="Tìm kiếm cơ bản" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Tìm kiếm cơ bản</SelectItem>
                  <SelectItem value="advanced">Tìm kiếm nâng cao</SelectItem>
                  <SelectItem value="adjacent">Tìm kiếm từ liền kề</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="ml-2 bg-orange-500 text-white px-4 my-1 rounded-lg whitespace-nowrap hover:bg-orange-800">
            <div>Tìm kiếm</div>
          </Button>
        </div>
        <div className="relative w-full h-64">
          <div
            className="absolute top-0 right-0 bg-cover bg-center  rounded-2xl"
            style={{
              backgroundImage: 'url("/image_overview.png")',
              width: "97%",
              height: "90%",
            }}
          ></div>
          <div className="flex absolute bottom-0 left-0 w-full h-[60%]">
            <div className="flex flex-col bg-white rounded-2xl shadow-md w-[35%] overflow-hidden">
              <div className="flex items-center w-full pt-7 pl-[8%]">
                <div className="px-[2%]">
                  <BookshelfIcon className="h-4 w-4" />
                </div>
                <div className="p-3">
                  <h2 className="text-base text-[#374151] text-nowrap">
                    Bài kinh
                  </h2>
                  <p className="text-4xl font-bold">2406</p>
                </div>
              </div>
              <div className="flex items-end justify-items-end text-nowrap pr-4 pb-4 cursor-pointer">
                <div className="flex border ml-auto border-gray-300 rounded-lg px-2 hover:bg-gray-100">
                  <p className="text-xs font-semibold m-1 ml-3">Chi tiết</p>
                  <HiMiniArrowSmallRight style={{ fontSize: "1.4em" }} />
                </div>
              </div>
            </div>
            <div className="flex flex-col bg-white rounded-2xl shadow-md w-[35%] ml-4 overflow-hidden">
              <div className="flex items-center w-full pt-7 pl-[8%]">
                <div className="px-[2%]">
                  <BsPersonCircle className="h-7 w-7" />
                </div>
                <div className="p-3">
                  <h2 className="text-base text-[#374151] text-nowrap">
                    Tài khoản dịch giả
                  </h2>
                  <p className="text-4xl font-bold">2406</p>
                </div>
              </div>
              <div className="flex items-end justify-items-end text-nowrap pr-4 pb-4 cursor-pointer">
                <div className="flex border ml-auto border-gray-300 rounded-lg px-2  hover:bg-gray-100">
                  <p className="text-xs font-semibold m-1 ml-3">Chi tiết</p>
                  <HiMiniArrowSmallRight style={{ fontSize: "1.4em" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex mt-4">
          <div className="flex bg-white border border-gray-300 rounded-2xl mt-4 p-5 overflow-auto h-full">
            <div className="flex space-x-64">
              <p className="text-lg font-semibold w-full text-nowrap p-3">
                Khiếu nại chưa giải quyết (3)
              </p>
              <div className="flex text-orange-500 mt-0.5 text-nowrap hover:bg-orange-200 p-3 rounded-lg cursor-pointer">
                Xem tất cả{" "}
                <HiMiniArrowSmallRight style={{ fontSize: "1.4em" }} />
              </div>
            </div>
            {/* <CustomTable /> */}
          </div>
          <CommonCard
            link="/dashboard"
            linkLabel="Xem tất cả"
            title="Bài dịch mới nhất"
          >
            {children.map((c, index) => (
              <div key={index} className="pb-4">
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
      <div className="fixed flex-1 right-0 border border-gray-300 overflow-auto rounded-tl-3xl rounded-bl-3xl bg-white h-full ml-3 divide-y-2 min-w-80">
        <div className="mb-4 m-6">
          <LuClock style={{ fontSize: "1.3em", margin: "10px 0" }} />
          <h2 className="text-lg font-semibold">Lịch sử hoạt động hệ thống</h2>
        </div>
        <div className="space-y-8">
          <div className="mt-4"></div>
          {history.map((h, index) => (
            <div key={index} className="m-6">
              <div className="text-cyan-500">{h.title}</div>
              <div className="text-gray-500 text-xs">{h.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverviewAdminPage;
