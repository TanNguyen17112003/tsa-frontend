import { HiMagnifyingGlass } from "react-icons/hi2";
import { CustomTable } from "src/components/custom-table";
import { Input } from "src/components/shadcn/ui/input";
import getAcronymsNameTableConfig from "./acronyms-name-table-config";
import AcronymsNameEditSheet from "./AcronymsNameEditSheet";
import usePagination from "src/hooks/use-pagination";
import Pagination from "src/components/ui/Pagination";
import { SIDE_NAV_WIDTH } from "src/config";
import { useDrawer } from "src/hooks/use-drawer";
import { useEffect, useMemo, useState } from "react";
import { getFormData } from "src/utils/api-request";
import { useFormatSutrasContext } from "src/contexts/format-sutras/format-sutras-context";
import { FormatSutra } from "src/types/format-sutra";
import CategoriesDeleteDialog from "./CategoriesDeleteDialog";
import getPaginationText from "src/utils/get-pagination-text";

const AcronymsNameTab = () => {
  const { getFormatSutrasApi } = useFormatSutrasContext();
  const [id, setId] = useState<string>();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const name = useMemo(() => {
    return getFormatSutrasApi.data || [];
  }, [getFormatSutrasApi.data]);

  const editDrawer = useDrawer<FormatSutra>();

  const acronymsNameTableConfig = useMemo(() => {
    return getAcronymsNameTableConfig({
      onClickDelete: (item) => {
        setId(item.id);
        setIsOpen(true);
      },
      onClickEdit: (item) => {
        editDrawer.handleOpen(item);
      },
    });
  }, [editDrawer]);

  useEffect(() => {
    if (!isOpen) setId(undefined);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const pagination = usePagination({ count: name.length });

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
                formatSutra={editDrawer.data}
              />
            </div>
          </div>
          <CategoriesDeleteDialog
            state={isOpen}
            onClose={() => setIsOpen(false)}
            data="tên viết tắt"
            id={id || ""}
          />
        </div>
        <CustomTable
          rows={name}
          configs={acronymsNameTableConfig}
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

export default AcronymsNameTab;
