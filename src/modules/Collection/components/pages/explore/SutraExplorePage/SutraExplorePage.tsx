import { useRouter } from "next/router";
import { useCallback, useMemo, type FC } from "react";
import { PiTrashBold } from "react-icons/pi";
import { CustomTable } from "src/components/custom-table";
import { Button } from "src/components/shadcn/ui/button";
import Pagination from "src/components/ui/Pagination";
import { useCollectionCategoriesContext } from "src/contexts/collections/collection-categories-context";
import { useSutrasContext } from "src/contexts/sutras/sutras-context";
import { useDrawer } from "src/hooks/use-drawer";
import useFunction from "src/hooks/use-function";
import usePagination from "src/hooks/use-pagination";
import { useSelection } from "src/hooks/use-selection";
import { initialCollection } from "src/types/collection";
import { SutraDetail, enrichSutra } from "src/types/sutra";
import getPaginationText from "src/utils/get-pagination-text";
import CollectionBreadcrumb from "../../../CollectionBreadcrumb";
import SutraEditSheet from "./SutraEditSheet";
import { sutraTableConfigs } from "./sutraTableConfigs";
import { useAuth } from "src/hooks/use-auth";

interface SutraExplorePageProps {}

const SutraExplorePage: FC<SutraExplorePageProps> = ({}) => {
  const router = useRouter();
  const { user } = useAuth();
  const { tree, categories, goSutra } = useCollectionCategoriesContext();
  const { collection } = useSutrasContext();

  const { getSutrasApi, deleteSutra } = useSutrasContext();
  const editDrawer = useDrawer<SutraDetail>();

  const sutras = useMemo(() => {
    return (getSutrasApi.data || []).map((s) =>
      enrichSutra(s, tree, categories)
    );
  }, [categories, getSutrasApi.data, tree]);

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
      goSutra(row.id);
    },
    [goSutra]
  );

  const handleDeleteHelper = useFunction(handleDelete, {
    successMessage: "Xoá bộ kinh thành công!",
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

            <SutraEditSheet
              collection={collection || initialCollection}
              open={editDrawer.open}
              onOpenChange={(open) =>
                open ? editDrawer.handleOpen() : editDrawer.handleClose()
              }
              sutra={editDrawer.data}
            />
          </div>
        )}
      </div>
      <div className="px-4 flex-1 pb-6">
        <CustomTable
          loading={getSutrasApi.loading}
          select={user?.role == "admin" ? select : undefined}
          rows={sutras}
          configs={sutraTableConfigs}
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

export default SutraExplorePage;
