import { HiMagnifyingGlass } from "react-icons/hi2";
import { CustomTable } from "src/components/custom-table";
import { Button } from "src/components/shadcn/ui/button";
import { Input } from "src/components/shadcn/ui/input";
import { initialCirca } from "src/types/circas";
import getCircasTableConfig from "./circa-table-config";
import { useMemo } from "react";
import CircaEditSheet from "./CircaEditSheet";
import usePagination from "src/hooks/use-pagination";
import Pagination from "src/components/ui/Pagination";

const circa = [initialCirca];

const Circa = () => {
  const accountCircasConfig = useMemo(() => {
    return getCircasTableConfig({
      onClickDelete: (data) => {},
    });
  }, []);
  const pagination = usePagination({ count: circa.length });
  return (
    <div className="flex flex-col divide-y-2 min-h-[87.5vh]">
      <div className=" flex-grow flex-col px-[10%]">
        <div className="flex py-[32px] space-x-3">
          <div className="flex p-2  border border-gray-300 rounded-md h-12 w-full">
            <div className="flex w-full items-center">
              <Input
                type="text"
                placeholder="Tìm kiếm"
                className="border-none outline-none w-full text-sm/normal"
              />
              <HiMagnifyingGlass
                style={{ fontSize: "1.5rem", color: "gray" }}
              />
            </div>
          </div>
          <div className="flex ml-auto items-center">
            <CircaEditSheet />
          </div>
        </div>
        <CustomTable
          rows={circa}
          configs={accountCircasConfig}
          tableClassName="rounded-xl border-2"
          pagination={pagination}
          hidePagination
        ></CustomTable>
      </div>
      <div className="flex px-7 justify-between py-2">
        <div className="flex text-sm text-gray-500 font-normal items-center overflow-hidden text-nowrap">
          Đang hiển thị kết quả thứ 1 tới 10 trên 97 kết quả
        </div>
        <Pagination {...pagination} onChange={pagination.onPageChange} />
      </div>
    </div>
  );
};

export default Circa;
