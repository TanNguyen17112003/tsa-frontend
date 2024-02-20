import { useEffect } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { Button } from "src/components/shadcn/ui/button";
import { Input } from "src/components/shadcn/ui/input";
import { useAuth } from "src/hooks/use-auth";
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import type { Page as PageType } from "src/types/page";

const Page: PageType = () => {
  return (
    <div className="flex flex-col divide-y-[1px] min-h-screen">
      <div className="flex-grow px-7 pt-7 pb-2 divide-">
        <div className="items-center">
          <div className="text-2xl font-semibold">Danh mục</div>
          <div className="flex space-x-4 my-4">
            <div>Quản lý tác giả</div>
            <div>Định dạng trang</div>
            <div>Tên viết tắt tuyển tập</div>
            <div>Từ viết tắt</div>
            <div>Niên đại</div>
          </div>
        </div>
        <div className="flex space-x-4 ">
          <div className="flex border border-gray-300 rounded-md h-11 w-full">
            <div className="flex w-full items-center">
              <Input
                type="text"
                placeholder="Tìm kiếm"
                className="border-none outline-none w-full text-sm/normal"
              />
              <HiMagnifyingGlass
                style={{ fontSize: "1.5rem", color: "gray" }}
              />
            </div>
          </div>
          <div className="">
            <Button className=" bg-[#F97316] py-[22px] px-[16px] rounded-lg text-white text-nowrap">
              Thêm tác giả
            </Button>
          </div>
        </div>
        <div>Table</div>
      </div>
      <div className="flex px-7 ">
        <div className="flex text-sm text-gray-500 font-normal items-center overflow-hidden text-nowrap">
          Đang hiển thị kết quả thứ 1 tới 10 trên 97 kết quả
        </div>
        <div className="flex items-center border rounded-lg ml-auto divide-x-2 my-2">
          <a href="#" className="border px-3 py-1.5">
            &lt;
          </a>
          <a
            href="#"
            className="border border-orange-500 px-3 py-1.5 bg-[#F97316]"
          >
            1
          </a>
          <a href="#" className="border px-3 py-1.5">
            2
          </a>
          <a href="#" className="border px-3 py-1.5">
            3
          </a>
          <span className="border px-3 py-1.5">...</span>
          <a href="#" className="border px-3 py-1.5">
            8
          </a>
          <a href="#" className="border px-3 py-1.5">
            9
          </a>
          <a href="#" className="border px-2 py-1.5">
            10
          </a>
          <a href="#" className="border px-3 py-1.5">
            &gt;
          </a>
        </div>
      </div>
    </div>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
