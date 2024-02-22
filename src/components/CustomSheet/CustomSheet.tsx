"use client";
import type { FC, ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "../shadcn/ui/sheet";
import { Button } from "../shadcn/ui/button";
import { FaArrowLeftLong } from "react-icons/fa6";

interface CustomSheetProps {
  sheetTrigger: ReactNode;
  children: ReactNode;
  title: string;
  actions: ReactNode;
}

const CustomSheet: FC<CustomSheetProps> = ({
  sheetTrigger,
  title,
  actions,
  children,
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>{sheetTrigger}</SheetTrigger>
      <SheetContent className="p-0 w-[700px] sm:max-w-[36rem]">
        <div className="flex p-3">
          <div className="flex-1">
            <Button variant="ghost" size="sm" className="text-primary gap-2">
              <FaArrowLeftLong />
              <span className="label">Quay lại</span>
            </Button>
            <div className="text-2xl font-bold text-nowrap">{title}</div>
          </div>
          <div>{actions}</div>
        </div>
        <hr />
        <div className="p-3">{children}</div>
      </SheetContent>
    </Sheet>
  );
};

export default CustomSheet;
