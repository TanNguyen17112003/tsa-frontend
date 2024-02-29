import { useMemo, type FC, useCallback, useEffect } from "react";
import { PiTrashBold } from "react-icons/pi";
import { CustomTable } from "src/components/custom-table";
import { Button } from "src/components/shadcn/ui/button";
import Pagination from "src/components/ui/Pagination";
import { useVolumesContext } from "src/contexts/volumes/volumes-context";
import { useDrawer } from "src/hooks/use-drawer";
import usePagination from "src/hooks/use-pagination";
import { useSelection } from "src/hooks/use-selection";
import { VolumeDetail } from "src/types/volume";
import useFunction from "src/hooks/use-function";
import { useRouter } from "next/router";
import { volumeTableConfigs } from "./volumeTableConfigs";
import { initialSutra } from "src/types/sutra";
import VolumeEditSheet from "./VolumeEditSheet";
import CollectionBreadcrumb from "../../../CollectionBreadcrumb";

interface VolumeExplorePageProps {
  sutraId: string;
}

const VolumeExplorePage: FC<VolumeExplorePageProps> = ({ sutraId }) => {
  const router = useRouter();

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
      router.replace({
        pathname: router.pathname,
        query: { ...router.query, volumeId: row.id },
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

          <VolumeEditSheet
            sutra={sutra || initialSutra}
            open={editDrawer.open}
            onOpenChange={(open) =>
              open ? editDrawer.handleOpen() : editDrawer.handleClose()
            }
            volume={editDrawer.data}
          />
        </div>
      </div>
      <div className="px-4 flex-1 pb-6">
        <CustomTable
          loading={getVolumesApi.loading}
          select={select}
          rows={volumes}
          configs={volumeTableConfigs}
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

export default VolumeExplorePage;
