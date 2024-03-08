import { HiMagnifyingGlass } from "react-icons/hi2";
import { CustomTable } from "src/components/custom-table";
import { Input } from "src/components/shadcn/ui/input";
import getAcronymsNameTableConfig from "./acronyms-name-table-config";
import AcronymsNameEditSheet from "./AcronymsNameEditSheet";
import usePagination from "src/hooks/use-pagination";
import Pagination from "src/components/ui/Pagination";
import { SIDE_NAV_WIDTH } from "src/config";
import { useDrawer } from "src/hooks/use-drawer";
import { useEffect, useMemo } from "react";
import { getFormData } from "src/utils/api-request";
import { useFormatSutrasContext } from "src/contexts/format-sutras/format-sutras-context";

const AcronymsNameTab = () => {
  const { getFormatSutrasApi } = useFormatSutrasContext();

  useEffect(() => {
    getFormatSutrasApi.call(getFormData({}));
  }, []);

  const name = useMemo(() => {
    return getFormatSutrasApi.data || [];
  }, [getFormatSutrasApi.data]);

  const pagination = usePagination({ count: name.length });
  const editDrawer = useDrawer();
  return (
    <div className="flex flex-col divide-y-2 min-h-[87.5vh]">
      <div className="flex-col flex-grow px-[10%]">
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
          <div className="ml-auto flex">
            <div className="flex items-center">
              <AcronymsNameEditSheet
                open={editDrawer.open}
                onOpenChange={(open) =>
                  open ? editDrawer.handleOpen() : editDrawer.handleClose()
                }
              />
            </div>
          </div>
        </div>
        <CustomTable
          rows={name}
          configs={getAcronymsNameTableConfig}
          tableClassName="rounded-xl border-2"
          pagination={pagination}
          hidePagination
        ></CustomTable>
      </div>
      <div
        className={`fixed bg-white flex bottom-0 px-7 justify-between py-2 w-[calc(100vw-${SIDE_NAV_WIDTH}px)]`}
      >
        <div className="flex text-sm text-gray-500 font-normal items-center overflow-hidden text-nowrap">
          Đang hiển thị kết quả thứ 1 tới 10 trên 97 kết quả
        </div>
        <Pagination {...pagination} onChange={pagination.onPageChange} />
      </div>
    </div>
  );
};

export default AcronymsNameTab;
