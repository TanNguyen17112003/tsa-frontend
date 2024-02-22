"use client";
import type { FC } from "react";
import CustomSheet from "src/components/CustomSheet";
import { Button } from "src/components/shadcn/ui/button";
import { Input } from "src/components/shadcn/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "src/components/shadcn/ui/select";

export interface AccountEditSheetProps {}

const AccountEditSheet: FC<AccountEditSheetProps> = ({}) => {
  return (
    <CustomSheet
      sheetTrigger={<Button>Thêm tài khoản</Button>}
      title={"Thêm tài khoản"}
      actions={<Button>Xác nhận thêm</Button>}
    >
      <div className="flex flex-col gap-2">
        <div className="text-sm font-semibold pb-2">Thông tin tài khoản</div>
        <div className="space-y-2">
          <div className="text-xs font-semibold pl-1">Họ và tên</div>
          <Input placeholder="Nhập họ và tên" />

          <div className="text-xs font-semibold pl-1">Email {"(*)"}</div>
          <Input placeholder="Nhập email" />

          <div className="text-xs font-semibold pl-1">
            Tên tài khoản {"(*)"}
          </div>
          <Input placeholder="Tên tài khoản" />

          <div className="text-xs font-semibold pl-1">Mật khẩu</div>
          <Input placeholder="Nhập mật khẩu" value="siu@123" />
        </div>
        <div className="text-sm font-semibold pb-2">Thiết lập quyền</div>
        <div>
          <div className="text-xs font-semibold pl-1 pb-2">
            Cho phép dịch giả
          </div>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chỉ xem được khiếu nại" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="1">Chỉ xem được khiếu nại</SelectItem>
                <SelectItem value="2">Được xử lý khiếu nại</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </CustomSheet>
  );
};

export default AccountEditSheet;
