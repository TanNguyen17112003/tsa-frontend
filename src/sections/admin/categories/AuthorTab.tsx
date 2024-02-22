import { HiMagnifyingGlass } from "react-icons/hi2";
import { CustomTable } from "src/components/custom-table";
import { Button } from "src/components/shadcn/ui/button";
import { Input } from "src/components/shadcn/ui/input";
import { initialUser } from "src/types/user";
import getAccountTableConfig from "./author-table-config";
import { useMemo } from "react";
import { FaLongArrowAltLeft } from "react-icons/fa";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "src/components/shadcn/ui/sheet";
import AccountEditSheet from "./AccountEditSheet";
import Pagination from "src/components/ui/Pagination";
import usePagination from "src/hooks/use-pagination";

const AccountManagement = () => {
  const user = [initialUser];
  const accountTableConfig = useMemo(() => {
    return getAccountTableConfig({
      onClickDelete: (data) => {},
    });
  }, []);
  const pagination = usePagination({ count: user.length });
  return (
    <div className="flex flex-col divide-y-2 min-h-[87.5vh]">
      <div className="flex-grow flex-col mx-[10%]">
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
          <div className="ml-auto flex">
            <div className="flex items-center">
              <AccountEditSheet />
            </div>
          </div>
        </div>
        <div className="flex-grow pb-5">
          <CustomTable
            rows={user}
            configs={accountTableConfig}
            tableClassName="rounded-xl border-2"
            pagination={pagination}
            hidePagination
          ></CustomTable>
        </div>
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

export default AccountManagement;
