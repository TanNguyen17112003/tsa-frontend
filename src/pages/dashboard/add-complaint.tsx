import { useEffect } from "react";
import { Button } from "src/components/shadcn/ui/button";
import { Input } from "src/components/shadcn/ui/input";
import { useAuth } from "src/hooks/use-auth";
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import type { Page as PageType } from "src/types/page";

const Page: PageType = () => {
  return (
    <div className="px-[10%]">
      <div className="text-2xl font-semibold py-8">Khiếu nại</div>
      <div className="flex border border-[#E5E7EB] py-8 px-7 space-x-8 w-full rounded-3xl">
        <div className="w-full space-y-2">
          <div className="text-xs font-semibold">Email</div>
          <Input placeholder="Nhập email của bạn tại đây" />
        </div>
        <div className="flex-col w-full space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-semibold">Tiêu đề</div>
            <Input placeholder="Nhập tiêu đề" />
          </div>
          <div className="space-y-2">
            <div className="text-xs font-semibold">Nội dung</div>
            <Input placeholder="Nhập nội dung feedback tại đây." />
            <div className="text-xs font-normal text-[#4B5563]">
              Tối đa 500 ký tự
            </div>
          </div>
          <Button className="flex ml-auto">Gửi khiếu nại</Button>
        </div>
      </div>
    </div>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
