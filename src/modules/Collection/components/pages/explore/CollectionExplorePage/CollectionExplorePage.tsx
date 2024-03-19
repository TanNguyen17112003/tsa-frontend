import { useMemo, type FC, useCallback } from "react";
import { BiDownload } from "react-icons/bi";
import { PiTrashBold } from "react-icons/pi";
import { CustomTable } from "src/components/custom-table";
import { Button } from "src/components/shadcn/ui/button";
import Pagination from "src/components/ui/Pagination";
import { useCollectionsContext } from "src/contexts/collections/collections-context";
import { useDrawer } from "src/hooks/use-drawer";
import usePagination from "src/hooks/use-pagination";
import { useSelection } from "src/hooks/use-selection";
import { CollectionDetail, enrichCollection } from "src/types/collection";
import CollectionBreadcrumb from "../../../CollectionBreadcrumb";
import CollectionEditSheet from "./CollectionEditSheet";
import collectionTableConfigs from "./collectionTableConfigs";
import useFunction from "src/hooks/use-function";
import { useRouter } from "next/router";
import getPaginationText from "src/utils/get-pagination-text";
import { useCollectionCategoriesContext } from "src/contexts/collections/collection-categories-context";
import { useAuth } from "src/hooks/use-auth";

interface CollectionExplorePageProps {}

const CollectionExplorePage: FC<CollectionExplorePageProps> = ({}) => {
  const { user } = useAuth();
  const router = useRouter();
  const { tree } = useCollectionCategoriesContext();
  const { deleteCollection, getCollectionsApi } = useCollectionsContext();
  const editDrawer = useDrawer<CollectionDetail>();

  const collections = useMemo(() => {
    return (getCollectionsApi.data || []).map((c) => enrichCollection(c, tree));
  }, [getCollectionsApi.data, tree]);

  const pagination = usePagination({ count: collections.length });
  const select = useSelection<CollectionDetail>(collections);

  const handleDelete = useCallback(
    async ({}) => {
      await deleteCollection(select.selected.map((select) => select.id));
    },
    [deleteCollection, select.selected]
  );

  const handleClickRow = useCallback(
    (row: CollectionDetail) => {
      router.replace({
        pathname: router.pathname,
        query: { ...router.query, collectionId: row.id },
      });
    },
    [router]
  );

  const handleDeleteHelper = useFunction(handleDelete, {
    successMessage: "Xoá tuyển tập kinh thành công!",
  });

  return (
    <>
      <div className="flex justify-between p-5 py-6 sticky top-0 z-10 bg-white">
        <CollectionBreadcrumb />
        {user?.role == "admin" && (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              color="destructive"
              className="gap-2 text-destructive hover:bg-destructive/20 hover:text-destructive"
              disabled={
                select.selected.length == 0 || handleDeleteHelper.loading
              }
              onClick={handleDeleteHelper.call}
            >
              <PiTrashBold className="w-5 h-5" /> Xoá
            </Button>
            <Button variant="outline" className="gap-2">
              Xuất báo cáo <BiDownload className="w-5 h-5" />
            </Button>
            <CollectionEditSheet
              open={editDrawer.open}
              onOpenChange={(open) =>
                open ? editDrawer.handleOpen() : editDrawer.handleClose()
              }
              collection={editDrawer.data}
            />
          </div>
        )}
      </div>
      <div className="px-4 flex-1 pb-6">
        <CustomTable
          select={user?.role == "admin" ? select : undefined}
          rows={collections}
          configs={collectionTableConfigs}
          pagination={pagination}
          onClickEdit={
            user?.role == "admin" ? editDrawer.handleOpen : undefined
          }
          onClickRow={handleClickRow}
          hidePagination
        />
      </div>
      <div className="sticky bg-white flex bottom-0 px-7 justify-between py-2 border-t">
        <div className="flex text-sm text-gray-500 font-normal items-center overflow-hidden text-nowrap">
          {getPaginationText(pagination)}
        </div>
        <Pagination {...pagination} onChange={pagination.onPageChange} />
      </div>
    </>
  );
};

export default CollectionExplorePage;
