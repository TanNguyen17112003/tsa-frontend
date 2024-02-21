import { useMemo } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { CustomTable } from "src/components/custom-table";
import { Input } from "src/components/shadcn/ui/input";
import Pagination from "src/components/ui/Pagination";
import usePagination from "src/hooks/use-pagination";
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import AccountEditSheet from "src/sections/admin/accounts/AccountEditSheet";
import getAccountTableConfig from "src/sections/admin/accounts/account-table-config";
import type { Page as PageType } from "src/types/page";
import { User, initialUser } from "src/types/user";
import getAccountTableConfig from "./account-table-config/account-table-config";
import PageHeader from "src/components/PageHeader";

const Page: PageType = () => {
  const accountTableConfig = useMemo(() => {
    return getAccountTableConfig({
      onClickDelete: (data) => {},
    });
  }, []);

  const pagination = usePagination({ count: users.length });

  return (
    <div className="flex flex-col divide-y-[1px] space-y-4 min-h-screen">
      {/* <div className="flex items-center px-7 pt-7 pb-2 ">
        <div className="text-2xl font-semibold">Quản lý tài khoản</div>

        <div className="ml-auto">
          <AccountEditSheet />
        </div>
      </div> */}
      <div className="flex items-center px-7 pt-7 pb-2 ">
        <PageHeader
          title="Quản lý tài khoản"
          buttonLabel="Thêm tài khoản"
          link="/dashboard/accounts"
        ></PageHeader>
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
        <CustomTable
          rows={users}
          configs={accountTableConfig}
          tableClassName="rounded-xl border-2"
          pagination={pagination}
          hidePagination
        ></CustomTable>
      </div>
      <div className="flex px-7 justify-between py-2">
        <div className="flex text-sm text-gray-500 font-normal items-center overflow-hidden text-nowrap">
          Đang hiển thị kết quả thứ 1 tới 10 trên 97 kết quả
        </div>
        <Pagination {...pagination} onChange={pagination.onPageChange} />
      </div>
    </div>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
