"use client";
import type { FC } from "react";
import CustomSheet from "src/components/CustomSheet";
import { Button } from "src/components/shadcn/ui/button";
import { Input } from "src/components/shadcn/ui/input";

export interface AcronymsWordEditSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AcronymsWordEditSheet: FC<AcronymsWordEditSheetProps> = ({
  open,
  onOpenChange,
}) => {
  return (
    <CustomSheet
      open={open}
      onOpenChange={onOpenChange}
      sheetTrigger={<Button>Thêm tên viết tắt</Button>}
      title={"Thêm tên viết tắt"}
      actions={<Button>Xác nhận thêm</Button>}
    >
      <div className="flex flex-col gap-2">
        <div className="text-xs font-semibold ml-1">Từ đầy đủ</div>
        <Input type="text" placeholder="Nhập từ đầy đủ" />
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <div className="text-xs font-semibold ml-1">Từ viết tắt</div>
        <Input type="text" placeholder="Nhập từ viết tắt" />
      </div>
    </CustomSheet>
  );
};

export default AcronymsWordEditSheet;
