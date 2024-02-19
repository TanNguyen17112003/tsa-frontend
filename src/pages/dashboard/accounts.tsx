import { useEffect, useMemo } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { CustomTable } from "src/components/custom-table";
import { Button } from "src/components/shadcn/ui/button";
import { Input } from "src/components/shadcn/ui/input";
import { useAuth } from "src/hooks/use-auth";
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import type { Page as PageType } from "src/types/page";
import { User, initialUser } from "src/types/user";
import getAccountTableConfig from "./account-table-config/account-table-config";

const Page: PageType = () => {
  const account: User[] = [initialUser];

  const accountTableConfig = useMemo(() => {
    return getAccountTableConfig({
      onClickDelete: (data) => {},
    });
  }, []);

  return (
    <div className="flex flex-col divide-y-[1px] space-y-4 min-h-screen">
      <div className="flex items-center px-7 pt-7 pb-2 ">
        <div className="text-2xl font-semibold">Quản lý tài khoản</div>
        <div className="ml-auto">
          <Button className=" bg-[#F97316] py-[22px] px-[16px] rounded-lg text-white text-nowrap">
            Thêm tài khoản
          </Button>
        </div>
      </div>
      <div className="flex-grow space-y-7 mb-4 px-7 pt-7 pb-2 ">
        <div className="flex p-2  border border-gray-300 rounded-md h-12 w-full">
          <div className="flex w-full items-center">
            <Input
              type="text"
              placeholder="Tìm kiếm"
              className="border-none outline-none w-full text-sm/normal"
            />
            <HiMagnifyingGlass style={{ fontSize: "1.5rem", color: "gray" }} />
          </div>
        </div>
        {/* <div className="flex bg-gray-50 border h-2/3 items-center justify-center">
          Table
        </div> */}
        <CustomTable
          rows={account}
          configs={accountTableConfig}
          flexible
        ></CustomTable>
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
