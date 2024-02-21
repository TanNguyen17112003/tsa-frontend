"use client";
import type { FC } from "react";
import CustomSheet from "src/components/CustomSheet";
import { Button } from "src/components/shadcn/ui/button";
import { Input } from "src/components/shadcn/ui/input";

export interface SortNameEditSheetProps {}

const SortNameEditSheet: FC<SortNameEditSheetProps> = ({}) => {
  return (
    <CustomSheet
      sheetTrigger={<Button>Thêm tên viết tắt</Button>}
      title={"Thêm tên viết tắt tuyển tập"}
      actions={<Button>Xác nhận thêm</Button>}
    >
      <div className="flex flex-col gap-2">
        <div className="text-xs font-semibold ml-1">
          Tên tuyển tập {"(đầy đủ)"}
        </div>
        <Input type="text" placeholder="Nhập tên tuyển tập" />
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <div className="text-xs font-semibold ml-1">
          Tên tuyển tập {"(viết tắt)"}
        </div>
        <Input type="text" placeholder="Nhập tên viết tắt của tuyển tập" />
      </div>
    </CustomSheet>
  );
};

export default SortNameEditSheet;
