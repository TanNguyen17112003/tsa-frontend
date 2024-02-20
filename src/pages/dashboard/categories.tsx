import { useEffect } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import PageHeader from "src/components/PageHeader";
import { Button } from "src/components/shadcn/ui/button";
import { Input } from "src/components/shadcn/ui/input";
import { useAuth } from "src/hooks/use-auth";
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import type { Page as PageType } from "src/types/page";

const Page: PageType = () => {
  return (
    <div className="flex-col divide-y-2">
      <div className="mx-[10%] divide-y-2">
        <div className="mt-[32px]">
          <div></div>
          <PageHeader title="Danh mục"></PageHeader>
          <div className="flex space-x-4 overflow-hidden my-4">
            <div className="text-nowrap">Quản lý tác giả</div>
            <div className="text-nowrap">Định dạng trang</div>
            <div className="text-nowrap">Tên viết tắt tuyển tập</div>
            <div className="text-nowrap">Từ viết tắt</div>
            <div className="text-nowrap">Niên đại</div>
          </div>
        </div>
        <div className="flex py-[32px] space-x-3">
          <div className="flex p-2  border border-gray-300 rounded-md h-12 w-full">
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
          <div className="ml-auto">
            <Button className=" bg-[#F97316] py-[22px] px-[16px] rounded-lg text-white text-nowrap">
              Thêm tài khoản
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
