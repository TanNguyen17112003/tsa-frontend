import { useEffect, useMemo } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { UsersApi } from "src/api/users";
import PageHeader from "src/components/PageHeader";
import { CustomTable } from "src/components/custom-table";
import { Input } from "src/components/shadcn/ui/input";
import Pagination from "src/components/ui/Pagination";
import { useDrawer } from "src/hooks/use-drawer";
import useFunction from "src/hooks/use-function";
import usePagination from "src/hooks/use-pagination";
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import AccountEditSheet from "src/sections/admin/accounts/AccountEditSheet";
import getAccountTableConfig from "src/sections/admin/accounts/account-table-config";
import type { Page as PageType } from "src/types/page";
import { User, UserDetail, initialUser, users } from "src/types/user";
import { getFormData } from "src/utils/api-request";

const Page: PageType = () => {
  const accountTableConfig = useMemo(() => {
    return getAccountTableConfig({
      onClickDelete: (data) => {},
    });
  }, []);

  const editDrawer = useDrawer<UserDetail>();

  const pagination = usePagination({ count: users.length });

  const getUsersApi = useFunction(UsersApi.getUsers);
  useEffect(() => {
    getUsersApi.call(getFormData({}));
  }, []);

  const author = useMemo(() => {
    return getUsersApi.data || [];
  }, [getUsersApi.data]);

  return (
    <div className="flex flex-col space-y-4 min-h-screen">
      <PageHeader
        title="Quản lý tài khoản"
        button={
          <div className="ml-auto">
            <AccountEditSheet
              open={editDrawer.open}
              onOpenChange={(open) =>
                open ? editDrawer.handleOpen() : editDrawer.handleClose()
              }
            />
          </div>
        }
        variant="full-divide"
      />
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
          rows={author}
          configs={accountTableConfig}
          tableClassName="rounded-xl border-2"
          pagination={pagination}
          hidePagination
        ></CustomTable>
      </div>
      <div className="fixed bg-white flex bottom-0 px-7 justify-between py-2 w-[calc(100vw-280px)]">
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
