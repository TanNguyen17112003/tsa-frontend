import { HiMagnifyingGlass } from "react-icons/hi2";
import { CustomTable } from "src/components/custom-table";
import { Input } from "src/components/shadcn/ui/input";
import getAcronymsWordTableConfig from "./acronyms-word-table-config";
import AcronymsWordEditSheet from "./AcronymsWordEditSheet";
import Pagination from "src/components/ui/Pagination";
import usePagination from "src/hooks/use-pagination";
import { SIDE_NAV_WIDTH } from "src/config";
import { useDrawer } from "src/hooks/use-drawer";
import { useEffect, useMemo, useState } from "react";
import { getFormData } from "src/utils/api-request";
import { useFormatWordsContext } from "src/contexts/format-words/format-words-context";
import CategoriesDeleteDialog from "./CategoriesDeleteDialog";
import { FormatWord } from "src/types/format-word";
import getPaginationText from "src/utils/get-pagination-text";

const AcronymsWordTab = () => {
  const { getFormatWordsApi } = useFormatWordsContext();
  const [id, setId] = useState<string>();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const word = useMemo(() => {
    return getFormatWordsApi.data || [];
  }, [getFormatWordsApi.data]);

  const editDrawer = useDrawer<FormatWord>();

  const pagination = usePagination({ count: word.length });

  const acronymsNameTableConfig = useMemo(() => {
    return getAcronymsWordTableConfig({
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

  return (
    <div className="flex flex-col divide-y-2 min-h-[87.5vh]">
      <div className="flex-grow flex-col px-[10%]">
        <div className="flex py-[32px] space-x-3 ">
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
            <AcronymsWordEditSheet
              open={editDrawer.open}
              onOpenChange={(open) =>
                open ? editDrawer.handleOpen() : editDrawer.handleClose()
              }
              formatWord={editDrawer.data}
            />
          </div>
          <CategoriesDeleteDialog
            state={isOpen}
            onClose={() => setIsOpen(false)}
            data="từ viết tắt"
            id={id || ""}
          />
        </div>
        <CustomTable
          rows={word}
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

export default AcronymsWordTab;
