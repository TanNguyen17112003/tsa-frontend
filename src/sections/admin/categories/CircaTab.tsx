import { HiMagnifyingGlass } from "react-icons/hi2";
import { CustomTable } from "src/components/custom-table";
import { Input } from "src/components/shadcn/ui/input";
import getCircasTableConfig from "./circa-table-config";
import { useEffect, useMemo } from "react";
import CircaEditSheet from "./CircaEditSheet";
import usePagination from "src/hooks/use-pagination";
import Pagination from "src/components/ui/Pagination";
import { SIDE_NAV_WIDTH } from "src/config";
import { useDrawer } from "src/hooks/use-drawer";
import { getFormData } from "src/utils/api-request";
import { useCircasContext } from "src/contexts/circas/circas-context";

const CircaTab = () => {
  const accountCircasConfig = useMemo(() => {
    return getCircasTableConfig({
      onClickDelete: (data) => {},
    });
  }, []);

  const { getCircasApi } = useCircasContext();

  useEffect(() => {
    getCircasApi.call(getFormData({}));
  }, []);

  const circa = useMemo(() => {
    return getCircasApi.data || [];
  }, [getCircasApi.data]);

  const pagination = usePagination({ count: circa.length });
  const editDrawer = useDrawer();
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
            <CircaEditSheet
              open={editDrawer.open}
              onOpenChange={(open) =>
                open ? editDrawer.handleOpen() : editDrawer.handleClose()
              }
            />
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

export default CircaTab;
