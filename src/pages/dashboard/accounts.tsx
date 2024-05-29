import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import PageHeader from "src/components/PageHeader";
import { CustomTable } from "src/components/custom-table";
import { Input } from "src/components/shadcn/ui/input";
import Pagination from "src/components/ui/Pagination";
import UsersProvider, {
  useUsersContext,
} from "src/contexts/users/users-context";
import { AuthGuard } from "src/guards/auth-guard";
import { useAuth } from "src/hooks/use-auth";
import { useDrawer } from "src/hooks/use-drawer";
import usePagination from "src/hooks/use-pagination";
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import AccountEditSheet from "src/sections/admin/accounts/AccountEditSheet";
import AccountsDeleteDialog from "src/sections/admin/accounts/AccountsDeleteDialog";
import getAccountTableConfig from "src/sections/admin/accounts/account-table-config";
import type { Page as PageType } from "src/types/page";
import { User } from "src/types/user";
import getPaginationText from "src/utils/get-pagination-text";

const Page: PageType = () => {
  const [id, setId] = useState<string>();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const editDrawer = useDrawer<User>();
  const accountTableConfig = useMemo(() => {
    return getAccountTableConfig({
      onClickDelete: (item) => {
        setId(item.id);
        setIsOpen(true);
      },
      onClickEdit: (item) => {
        editDrawer.handleOpen(item);
      },
    });
  }, [editDrawer]);
  useEffect(() => {
    // if (!editDrawer.open) setData(undefined);
    if (!isOpen) setId(undefined);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const { getUsersApi } = useUsersContext();
  useEffect(() => {
    getUsersApi.call;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const author = useMemo(() => {
    return getUsersApi.data || [];
  }, [getUsersApi.data]);

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.role != "admin") {
      router.push("/dashboard");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const pagination = usePagination({ count: author.length });

  return (
    <div className="flex flex-col space-y-4 min-h-screen">
      {user?.role == "admin" && (
        <>
          <PageHeader
            title="Quản lý tài khoản"
            button={
              <div className="ml-auto">
                <AccountEditSheet
                  open={editDrawer.open}
                  onOpenChange={(open) =>
                    open ? editDrawer.handleOpen() : editDrawer.handleClose()
                  }
                  account={editDrawer.data}
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
                <HiMagnifyingGlass
                  style={{ fontSize: "1.5rem", color: "gray" }}
                />
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
          <AccountsDeleteDialog
            state={isOpen}
            onClose={() => setIsOpen(false)}
            id={id || ""}
          />
          <div className="fixed bg-white flex bottom-0 px-7 justify-between py-2 w-[calc(100vw-280px)]">
            <div className="flex text-sm text-gray-500 font-normal items-center overflow-hidden text-nowrap">
              {getPaginationText(pagination)}
            </div>
            <Pagination {...pagination} onChange={pagination.onPageChange} />
          </div>
        </>
      )}
    </div>
  );
};

Page.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      <UsersProvider>{page}</UsersProvider>
    </DashboardLayout>
  </AuthGuard>
);

export default Page;
