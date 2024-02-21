import { HiMagnifyingGlass } from "react-icons/hi2";
import { CustomTable } from "src/components/custom-table";
import { Button } from "src/components/shadcn/ui/button";
import { Input } from "src/components/shadcn/ui/input";
import { initialUser } from "src/types/user";
import getAccountTableConfig from "./quan-ly-tac-gia-table-config";
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

const AccountManagement = () => {
  const user = [initialUser];
  const accountTableConfig = useMemo(() => {
    return getAccountTableConfig({
      onClickDelete: (data) => {},
    });
  }, []);
  return (
    <div className="flex-col">
      <div className="flex py-[32px] space-x-3">
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
        <div className="ml-auto flex">
          <div className="flex items-center">
            <AccountEditSheet />
          </div>
        </div>
      </div>
      <CustomTable rows={user} configs={accountTableConfig}></CustomTable>
    </div>
  );
};

export default AccountManagement;
