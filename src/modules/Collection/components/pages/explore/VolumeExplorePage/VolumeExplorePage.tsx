import { useRouter } from "next/router";
import { useCallback, useMemo, type FC } from "react";
import { PiTrashBold } from "react-icons/pi";
import { CustomTable } from "src/components/custom-table";
import { Button } from "src/components/shadcn/ui/button";
import Pagination from "src/components/ui/Pagination";
import { useVolumesContext } from "src/contexts/volumes/volumes-context";
import { useDrawer } from "src/hooks/use-drawer";
import useFunction from "src/hooks/use-function";
import usePagination from "src/hooks/use-pagination";
import { useSelection } from "src/hooks/use-selection";
import { initialSutra } from "src/types/sutra";
import { VolumeDetail } from "src/types/volume";
import getPaginationText from "src/utils/get-pagination-text";
import CollectionBreadcrumb from "../../../CollectionBreadcrumb";
import VolumeEditSheet from "./VolumeEditSheet";
import { volumeTableConfigs } from "./volumeTableConfigs";
import { useAuth } from "src/hooks/use-auth";
import { useCollectionCategoriesContext } from "src/contexts/collections/collection-categories-context";

interface VolumeExplorePageProps {}

const VolumeExplorePage: FC<VolumeExplorePageProps> = ({}) => {
  const router = useRouter();
  const { user } = useAuth();
  const { goVolume } = useCollectionCategoriesContext();

  const { getVolumesApi, deleteVolume, sutra } = useVolumesContext();
  const editDrawer = useDrawer<VolumeDetail>();

  const volumes = useMemo(() => {
    return (getVolumesApi.data || []).map((volume) => ({
      ...volume,
      sutra: sutra || initialSutra,
    }));
  }, [getVolumesApi.data, sutra]);

  const pagination = usePagination({ count: volumes.length });
  const select = useSelection<VolumeDetail>(volumes);

  const handleDelete = useCallback(
    async ({}) => {
      await deleteVolume(select.selected.map((select) => select.id));
    },
    [deleteVolume, select.selected]
  );

  const handleClickRow = useCallback(
    (row: VolumeDetail) => {
      goVolume(row.id);
    },
    [goVolume]
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

            <VolumeEditSheet
              sutra={sutra || initialSutra}
              open={editDrawer.open}
              onOpenChange={(open) =>
                open ? editDrawer.handleOpen() : editDrawer.handleClose()
              }
              volume={editDrawer.data}
            />
          </div>
        )}
      </div>
      <div className="px-4 flex-1 pb-6">
        <CustomTable
          loading={getVolumesApi.loading}
          select={user?.role == "admin" ? select : undefined}
          rows={volumes}
          configs={volumeTableConfigs}
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

export default VolumeExplorePage;
