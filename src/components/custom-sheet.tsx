'use client';
import { type FC, type ReactNode } from 'react';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { Button } from './shadcn/ui/button';
import { Sheet, SheetContent, SheetTrigger } from './shadcn/ui/sheet';
import React from 'react';
import CustomTabs from './custom-tabs';
import { CustomTabsProps } from './custom-tabs';
import clsx from 'clsx';

interface CustomSheetProps {
  sheetTrigger: ReactNode;
  children: ReactNode;
  title: string;
  actions: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tabs?: CustomTabsProps;
}

const CustomSheet: FC<CustomSheetProps> = ({
  sheetTrigger,
  title,
  actions,
  open,
  onOpenChange,
  children,
  tabs
}) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{sheetTrigger}</SheetTrigger>
      <SheetContent className='p-0 w-[700px] sm:max-w-[36rem]'>
        <div className='flex p-4'>
          <div className='flex-1'>
            <Button
              variant='ghost'
              size='sm'
              className='text-primary gap-2'
              onClick={() => onOpenChange(false)}
            >
              <FaArrowLeftLong />
              <span className='label'>Quay lại</span>
            </Button>
            <div className='text-2xl font-bold text-nowrap'>{title}</div>
          </div>
          <div className='flex gap-2'>{actions}</div>
        </div>
        {tabs && <CustomTabs {...tabs} />}
        <hr className={clsx(tabs && '-mt-1')} />
        <div className='p-3'>{children}</div>
      </SheetContent>
    </Sheet>
  );
};

export default CustomSheet;
