"use client";
import type { FC } from "react";
import CustomSheet from "src/components/CustomSheet";
import { Button } from "src/components/shadcn/ui/button";

export interface AccountEditSheetProps {}

const AccountEditSheet: FC<AccountEditSheetProps> = ({}) => {
  return (
    <CustomSheet
      sheetTrigger={<Button>Thêm tài khoản</Button>}
      title={"Thêm tài khoản"}
      actions={<Button>Xác nhận thêm</Button>}
    >
      <div className="flex flex-col gap-2">TODO: form</div>
    </CustomSheet>
  );
};

export default AccountEditSheet;
