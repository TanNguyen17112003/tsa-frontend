import { useEffect, useMemo, useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { CustomTable } from "src/components/custom-table";
import { Input } from "src/components/shadcn/ui/input";
import { UserDetail, initialUser } from "src/types/user";
import getAccountTableConfig from "./author-table-config";

import Pagination from "src/components/ui/Pagination";
import { SIDE_NAV_WIDTH } from "src/config";
import { useDrawer } from "src/hooks/use-drawer";
import usePagination from "src/hooks/use-pagination";
import AuthorEditSheet from "./AuthorEditSheet";
import { useAuthorsContext } from "src/contexts/authors/authors-context";
import { Author } from "src/types/author";
import CategoriesDeleteDialog from "./CategoriesDeleteDialog";
import getPaginationText from "src/utils/get-pagination-text";

const AuthorTab = () => {
  const [id, setId] = useState<string>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const editDrawer = useDrawer<Author>();
  const accountTableConfig = useMemo(() => {
    return getAccountTableConfig({
      onClickDelete: (item) => {
        setId(item.id);
        setIsOpen(true);
      },
      onClickEdit: (item) => {
        editDrawer.handleOpen(item);
      },
    });
  }, []);

  const { getAuthorsApi } = useAuthorsContext();

  useEffect(() => {
    if (!isOpen) setId(undefined);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const author = useMemo(() => {
    return getAuthorsApi.data || [];
  }, [getAuthorsApi.data]);

  const pagination = usePagination({ count: author.length });

  return (
    <div className="divide-y-2">
      <div className="flex-col mx-[10%]">
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
              <AuthorEditSheet
                open={editDrawer.open}
                onOpenChange={(open) =>
                  open ? editDrawer.handleOpen() : editDrawer.handleClose()
                }
                author={editDrawer.data}
              />
            </div>
          </div>
        </div>
        <CategoriesDeleteDialog
          state={isOpen}
          onClose={() => setIsOpen(false)}
          data="tác giả"
          id={id || ""}
        />
        <div className="flex-grow pb-5">
          <CustomTable
            rows={author}
            configs={accountTableConfig}
            tableClassName="rounded-xl border-2"
            pagination={pagination}
            hidePagination
          ></CustomTable>
        </div>
      </div>
      {getPaginationText(pagination)}
    </div>
  );
};

export default AuthorTab;
