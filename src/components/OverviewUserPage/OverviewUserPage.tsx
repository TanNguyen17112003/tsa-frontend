import { useEffect, useState } from "react";
import { useAuth } from "src/hooks/use-auth";
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import type { Page as PageType } from "src/types/page";
import CommonCard from "src/components/CommonCard";
import {
  HiHandThumbUp,
  HiMagnifyingGlass,
  HiMiniArrowSmallRight,
} from "react-icons/hi2";
import { PiBookOpen } from "react-icons/pi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/shadcn/ui/select";
import { Button } from "src/components/shadcn/ui/button";
import { Input } from "src/components/shadcn/ui/input";
import { FaLongArrowAltRight } from "react-icons/fa";
import { BookshelfFillIcon } from "../icons/BookshelfFillIcon";
import { BsExclamationCircle, BsPersonCircle } from "react-icons/bs";
import { CustomTable } from "../custom-table";
import { Collection } from "src/types/collections";
import getDashboardTableConfig from "src/sections/user/dashboard/dashboard-table-config";
import { IoSearch } from "react-icons/io5";
import { FaBookOpen } from "react-icons/fa6";

const history = [
  { title: "Đọc bài kinh 1: Bài dịch số 2", time: "15:30 - 01/12/2023" },
  { title: "Tìm kiếm bài dịch số 62", time: "15:30 - 01/12/2023" },
  { title: "Đọc bài kinh 7: Bài dịch số 20", time: "15:30 - 01/12/2023" },
  { title: "Đọc bài kinh 3: Bài dịch số 21", time: "15:30 - 01/12/2023" },
  { title: "Tìm kiếm bài dịch số 62", time: "15:30 - 01/12/2023" },
  {
    title: "Khiếu nại lỗi dòng 23 bài Kinh dịch số 82",
    time: "15:30 - 01/12/2023",
  },
  { title: "Tìm kiếm bài dịch số 62", time: "15:30 - 01/12/2023" },
  { title: "Đọc bài kinh 5: Bài dịch số 26", time: "15:30 - 01/12/2023" },
];

const OverviewUserPage = () => {
  const data: Collection[] = [
    {
      id: "",
      name: "Kinh A Hàm",
      code: "",
      circa: "250 TCN - 360 TCN",
      created_at: "",
      user_id: "Nguyễn Văn A",
    },
    {
      id: "",
      name: "Kinh A Hàm",
      code: "",
      circa: "250 TCN - 360 TCN",
      created_at: "",
      user_id: "Nguyễn Văn A",
    },
    {
      id: "",
      name: "Kinh A Hàm",
      code: "",
      circa: "250 TCN - 360 TCN",
      created_at: "",
      user_id: "Nguyễn Văn A",
    },
    {
      id: "",
      name: "Kinh A Hàm",
      code: "",
      circa: "250 TCN - 360 TCN",
      created_at: "",
      user_id: "Nguyễn Văn A",
    },
    {
      id: "",
      name: "Kinh A Hàm",
      code: "",
      circa: "250 TCN - 360 TCN",
      created_at: "",
      user_id: "Nguyễn Văn A",
    },
    {
      id: "",
      name: "Kinh A Hàm",
      code: "",
      circa: "250 TCN - 360 TCN",
      created_at: "",
      user_id: "Nguyễn Văn A",
    },
  ];
  return (
    <div
      className="flex bg-cover bg-center w-full min-h-screen"
      style={{
        backgroundImage: 'url("/background.png")',
      }}
    >
      <div className="flex-1 w-full px-[10%]">
        <div className="text-2xl font-semibold leading-relaxed py-8">
          Trang chủ
        </div>

        <div className="relative w-full h-[357px]">
          <div
            className="flex bg-cover bg-center rounded-xl"
            style={{
              backgroundImage: 'url("/reader-overview-image.png")',
              width: "100%",
              height: "100%",
            }}
          >
            <div
              className="absolute z-0 bg-cover bg-center rounded-2xl"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(190, 79, 2, 0.7), transparent)",
                width: "30%",
                height: "100%",
              }}
            ></div>
            <div className="z-10 px-[42px] py-[82px] space-y-8">
              <div className="text-4xl font-semibold text-[#FFFFFF]">
                HỆ THỐNG <br /> ĐẠI TẠNG KINH <br /> VIỆT NAM
              </div>
              <Button className="flex bg-[#06B6D4] hover:bg-cyan-800 space-x-2">
                <div className="text-sm font-semibold">Khám phá</div>
                <FaLongArrowAltRight
                  style={{ fontSize: "1rem", marginTop: "2px" }}
                />
              </Button>
            </div>
          </div>
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
        <div className="flex space-x-6">
          <div className="flex flex-col bg-white rounded-2xl shadow-md w-[35%] overflow-hidden">
            <div className="flex items-center w-full py-7 pl-[8%]">
              <div className="px-[2%]">
                <BookshelfFillIcon className="h-8 w-8" />
              </div>
              <div className="p-3">
                <h2 className="text-base text-[#374151] text-nowrap">
                  Bộ kinh
                </h2>
                <p className="text-4xl font-bold">172</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col bg-white rounded-2xl shadow-md w-[35%] overflow-hidden">
            <div className="flex items-center w-full py-7 pl-[8%]">
              <div className="px-[2%]">
                <FaBookOpen className="h-8 w-8" />
              </div>
              <div className="p-3">
                <h2 className="text-base text-[#374151] text-nowrap">
                  Bài kinh
                </h2>
                <p className="text-4xl font-bold">172</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col bg-white rounded-2xl shadow-md w-[35%] ml-4 overflow-hidden">
            <div className="flex items-center w-full py-7 pl-[8%]">
              <div className="px-[2%]">
                <BsPersonCircle className="h-8 w-8" />
              </div>
              <div className="p-3">
                <h2 className="text-base text-[#374151] text-nowrap">
                  Số tác giả
                </h2>
                <p className="text-4xl font-bold">52</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col bg-white rounded-2xl shadow-md w-[35%] ml-4 overflow-hidden">
            <div className="flex items-center w-full py-7 pl-[8%]">
              <div className="px-[2%]">
                <HiHandThumbUp className="h-8 w-8" />
              </div>
              <div className="p-3">
                <h2 className="text-base text-[#374151] text-nowrap">
                  Số dịch giả
                </h2>
                <p className="text-4xl font-bold">32</p>
              </div>
            </div>
          </div>
        </div>
        <div className="my-4 flex overflow-hidden">
          <div className="w-full border rounded-3xl mt-4 bg-white">
            <div className="flex p-5 ">
              <div className="text-lg font-semibold w-full">
                Danh sách tuyển tập kinh
              </div>
              <div className="flex text-sm font-semibold text-primary text-nowrap hover:bg-orange-200 p-2 rounded-md">
                Xem tất cả{" "}
                <HiMiniArrowSmallRight style={{ fontSize: "1.4em" }} />
              </div>
            </div>
            <div className="bg-white ">
              <CustomTable rows={data} configs={getDashboardTableConfig} />
            </div>
          </div>
          <CommonCard title="Nhật ký hoạt động">
            {history.map((c, index) => (
              <div key={index} className="pb-4">
                <div className="flex space-x-2">
                  {c.title.slice(0, 3) == "Đọc" && (
                    <PiBookOpen style={{ fontSize: "1.4em" }} />
                  )}
                  {c.title.slice(0, 8) == "Tìm kiếm" && (
                    <IoSearch style={{ fontSize: "1.4em" }} />
                  )}
                  {c.title.slice(0, 9) == "Khiếu nại" && (
                    <BsExclamationCircle style={{ fontSize: "1.4em" }} />
                  )}
                  <div key={index} className="text-black-700">
                    {c.title}
                  </div>
                </div>
                <div key={index} className="text-gray-500 text-xs">
                  {c.time}
                </div>
              </div>
            ))}
          </CommonCard>
        </div>
      </div>
    </div>
  );
};

export default OverviewUserPage;
