import { useMemo, type FC, useCallback, useEffect } from "react";
import { PiTrashBold } from "react-icons/pi";
import { CustomTable } from "src/components/custom-table";
import { Button } from "src/components/shadcn/ui/button";
import Pagination from "src/components/ui/Pagination";
import { useOrisonsContext } from "src/contexts/orisons/orisons-context";
import { useDrawer } from "src/hooks/use-drawer";
import usePagination from "src/hooks/use-pagination";
import { useSelection } from "src/hooks/use-selection";
import { OrisonDetail } from "src/types/orison";
import useFunction from "src/hooks/use-function";
import { useRouter } from "next/router";
import { orisonTableConfigs } from "./orisonTableConfigs";
import { initialSutra } from "src/types/sutra";
import OrisonEditSheet from "./OrisonEditSheet";
import CollectionBreadcrumb from "../../../CollectionBreadcrumb";
import { useVolumesContext } from "src/contexts/volumes/volumes-context";
import { initialVolume } from "src/types/volume";
import getPaginationText from "src/utils/get-pagination-text";
import { useAuth } from "src/hooks/use-auth";

interface OrisonExplorePageProps {}

const OrisonExplorePage: FC<OrisonExplorePageProps> = ({}) => {
  const router = useRouter();
  const { user } = useAuth();
  const { sutra } = useVolumesContext();
  const { getOrisonsApi, deleteOrison, volume } = useOrisonsContext();
  const editDrawer = useDrawer<OrisonDetail>();

  const orisons = useMemo(() => {
    return (getOrisonsApi.data || []).map((orison) => ({
      ...orison,
      sutra: sutra || initialSutra,
    }));
  }, [getOrisonsApi.data, sutra]);
  const firstOrison = useMemo(() => orisons[0], [orisons]);
  const pagination = usePagination({ count: orisons.length });
  const select = useSelection<OrisonDetail>(orisons);

  const handleDelete = useCallback(
    async ({}) => {
      await deleteOrison(select.selected.map((select) => select.id));
    },
    [deleteOrison, select.selected]
  );

  const handleClickRow = useCallback(
    (row: OrisonDetail) => {
      router.replace({
        pathname: router.pathname,
        query: { ...router.query, orisonId: row.id },
      });
    },
    [router]
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

            <OrisonEditSheet
              volume={volume || initialVolume}
              sutra={sutra || initialSutra}
              open={editDrawer.open}
              onOpenChange={(open) =>
                open ? editDrawer.handleOpen() : editDrawer.handleClose()
              }
              orison={editDrawer.data}
            />
          </div>
        )}
      </div>
      <div className="px-4 flex-1 pb-6">
        <CustomTable
          loading={getOrisonsApi.loading}
          select={user?.role == "admin" ? select : undefined}
          rows={orisons}
          configs={orisonTableConfigs}
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

export default OrisonExplorePage;
