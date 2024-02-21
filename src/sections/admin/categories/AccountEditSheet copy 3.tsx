"use client";
import type { FC } from "react";
import CustomSheet from "src/components/CustomSheet";
import { Button } from "src/components/shadcn/ui/button";
import { Input } from "src/components/shadcn/ui/input";

export interface AccountEditSheetProps {}

const AccountEditSheet: FC<AccountEditSheetProps> = ({}) => {
  return (
    <CustomSheet
      sheetTrigger={<Button>Thêm tài khoản</Button>}
      title={"Thêm tài khoản"}
      actions={<Button>Xác nhận thêm</Button>}
    >
      <div className="flex flex-col gap-2">
        <div className="text-xs font-semibold ml-1">Nhâp tên tác giả</div>
        <Input type="text" placeholder="Nhập tên tác giả" />
      </div>
    </CustomSheet>
  );
};

export default AccountEditSheet;
