import { HiMagnifyingGlass } from "react-icons/hi2";
import { CustomTable } from "src/components/custom-table";
import { Input } from "src/components/shadcn/ui/input";
import getFormatTableConfig from "./format-table-config";
import Pagination from "src/components/ui/Pagination";
import usePagination from "src/hooks/use-pagination";
import { SIDE_NAV_WIDTH } from "src/config";
import { useEffect, useMemo } from "react";
import { getFormData } from "src/utils/api-request";
import { useFormatPagesContext } from "src/contexts/format-pages/format-pages-context";
import getPaginationText from "src/utils/get-pagination-text";

const FormatTab = () => {
  const { getFormatPagesApi } = useFormatPagesContext();

  useEffect(() => {
    getFormatPagesApi.call;
  }, []);

  const format = useMemo(() => {
    return getFormatPagesApi.data || [];
  }, [getFormatPagesApi.data]);

  const pagination = usePagination({ count: format.length });

  return (
    <div className="flex flex-col divide-y-2 min-h-[87.5vh]">
      <div className="flex-grow flex-col mx-[10%]">
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
        </div>
        <CustomTable
          rows={format}
          configs={getFormatTableConfig}
          tableClassName="rounded-xl border-2"
          pagination={pagination}
          hidePagination
        ></CustomTable>
      </div>
      <div
        className={`fixed bg-white flex bottom-0 px-7 justify-between py-2 w-[calc(100vw-${SIDE_NAV_WIDTH}px)]`}
      >
        <div className="flex text-sm text-gray-500 font-normal items-center overflow-hidden text-nowrap">
          {getPaginationText(pagination)}
        </div>
        <Pagination {...pagination} onChange={pagination.onPageChange} />
      </div>
    </div>
  );
};

export default FormatTab;
