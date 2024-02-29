import { useMemo, type FC, useCallback, useEffect } from "react";
import { PiTrashBold } from "react-icons/pi";
import { CustomTable } from "src/components/custom-table";
import { Button } from "src/components/shadcn/ui/button";
import Pagination from "src/components/ui/Pagination";
import { useSutrasContext } from "src/contexts/sutras/sutras-context";
import { useDrawer } from "src/hooks/use-drawer";
import usePagination from "src/hooks/use-pagination";
import { useSelection } from "src/hooks/use-selection";
import { SutraDetail } from "src/types/sutra";
import SutraEditSheet from "./SutraEditSheet";
import useFunction from "src/hooks/use-function";
import { useRouter } from "next/router";
import CollectionBreadcrumb from "../../../CollectionBreadcrumb";
import { sutraTableConfigs } from "./sutraTableConfigs";
import { useCollectionsContext } from "src/contexts/collections/collections-context";
import { initialCollection } from "src/types/collection";

interface SutraExplorePageProps {
  collectionId: string;
}

const SutraExplorePage: FC<SutraExplorePageProps> = ({ collectionId }) => {
  const router = useRouter();
  const { getCollectionsApi } = useCollectionsContext();
  const collection = useMemo(() => {
    return (
      getCollectionsApi.data?.find(
        (collection) => collection.id == collectionId
      ) || initialCollection
    );
  }, [collectionId, getCollectionsApi.data]);
  const { getSutrasApi, deleteSutra } = useSutrasContext();
  const editDrawer = useDrawer<SutraDetail>();

  const sutras = useMemo(() => {
    return getSutrasApi.data || [];
  }, [getSutrasApi.data]);

  const pagination = usePagination({ count: sutras.length });
  const select = useSelection<SutraDetail>(sutras);

  const handleDelete = useCallback(
    async ({}) => {
      await deleteSutra(select.selected.map((select) => select.id));
    },
    [deleteSutra, select.selected]
  );

  const handleClickRow = useCallback(
    (row: SutraDetail) => {
      router.replace({
        pathname: router.pathname,
        query: { ...router.query, sutraId: row.id },
      });
    },
    [router]
  );

  const handleDeleteHelper = useFunction(handleDelete, {
    successMessage: "Xoá bộ kinh thành công!",
  });

  useEffect(() => {
    getSutrasApi.call({ collection_id: collectionId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionId]);

  return (
    <>
      <div className="flex justify-between p-5 py-6 sticky top-0 z-10 bg-white">
        <CollectionBreadcrumb />
        <div className="flex gap-2">
          <Button
            variant="ghost"
            color="destructive"
            className="gap-2 text-destructive hover:bg-destructive/20 hover:text-destructive"
            disabled={select.selected.length == 0 || handleDeleteHelper.loading}
            onClick={handleDeleteHelper.call}
          >
            <PiTrashBold className="w-5 h-5" /> Xoá
          </Button>

          <SutraEditSheet
            collection={collection}
            open={editDrawer.open}
            onOpenChange={(open) =>
              open ? editDrawer.handleOpen() : editDrawer.handleClose()
            }
            sutra={editDrawer.data}
          />
        </div>
      </div>
      <div className="px-4 flex-1 pb-6">
        <CustomTable
          loading={getSutrasApi.loading}
          select={select}
          rows={sutras}
          configs={sutraTableConfigs}
          pagination={pagination}
          onClickEdit={editDrawer.handleOpen}
          onClickRow={handleClickRow}
          hidePagination
        />
      </div>
      <div className="sticky bg-white flex bottom-0 px-7 justify-between py-2 border-t">
        <div className="flex text-sm text-gray-500 font-normal items-center overflow-hidden text-nowrap">
          Đang hiển thị kết quả thứ{" "}
          {pagination.page * pagination.rowsPerPage + 1} tới{" "}
          {Math.min(
            pagination.count,
            pagination.rowsPerPage * (pagination.page + 1)
          )}{" "}
          trên {pagination.count} kết quả
        </div>
        <Pagination {...pagination} onChange={pagination.onPageChange} />
      </div>
    </>
  );
};

export default SutraExplorePage;
