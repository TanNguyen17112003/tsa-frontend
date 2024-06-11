import type { FC } from "react";
import CommonCard from "src/components/CommonCard";
import { BookshelfFillIcon } from "src/components/icons/BookshelfFillIcon";

interface OverviewStatsProps {}

const OverviewStats: FC<OverviewStatsProps> = ({}) => {
  return (
    <div className="flex space-x-6">
      <CommonCard title="">
        <div className="flex w-full pb-2">
          <div className="flex mt-3">
            <BookshelfFillIcon className="h-8 w-8" />
          </div>
          <div className="px-3">
            <h2 className="text-base text-nowrap">Bộ kinh</h2>
            <p className="text-4xl font-bold">172</p>
          </div>
        </div>
      </CommonCard>
      <CommonCard title="">
        <div className="flex w-full pb-1">
          <div className="flex mt-3">
            <BookshelfFillIcon className="h-8 w-8" />
          </div>
          <div className="px-3">
            <h2 className="text-base text-[#374151] text-nowrap">Bài kinh</h2>
            <p className="text-4xl font-bold">172</p>
          </div>
        </div>
      </CommonCard>
      <CommonCard title="">
        <div className="flex w-full pb-1">
          <div className="flex mt-3">
            <BookshelfFillIcon className="h-8 w-8" />
          </div>
          <div className="px-3">
            <h2 className="text-base text-[#374151] text-nowrap">Số tác giả</h2>
            <p className="text-4xl font-bold">52</p>
          </div>
        </div>
      </CommonCard>
      <CommonCard title="">
        <div className="flex w-full pb-1">
          <div className="flex mt-3">
            <BookshelfFillIcon className="h-8 w-8" />
          </div>
          <div className="px-3">
            <h2 className="text-base text-[#374151] text-nowrap">
              Số dịch giả
            </h2>
            <p className="text-4xl font-bold">32</p>
          </div>
        </div>
      </CommonCard>
    </div>
  );
};

export default OverviewStats;
