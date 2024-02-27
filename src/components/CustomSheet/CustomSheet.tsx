"use client";
import { useState, type FC, type ReactNode } from "react";
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
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CustomSheet: FC<CustomSheetProps> = ({
  sheetTrigger,
  title,
  actions,

  open,
  onOpenChange,
  children,
}) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{sheetTrigger}</SheetTrigger>
      <SheetContent className="p-0 w-[700px] sm:max-w-[36rem]">
        <div className="flex p-3">
          <div className="flex-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-primary gap-2"
              onClick={() => onOpenChange(false)}
            >
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
