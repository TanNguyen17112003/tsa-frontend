import { useMemo, type FC } from "react";
import CollectionBreadcrumb from "../../../CollectionBreadcrumb";
import { useCollectionsContext } from "src/contexts/collections/collections-context";
import { CustomTable } from "src/components/custom-table";
import usePagination from "src/hooks/use-pagination";
import collectionTableConfigs from "./collectionTableConfigs";
import Pagination from "src/components/ui/Pagination";
import { useSelection } from "src/hooks/use-selection";
import { CollectionDetail } from "src/types/collection";

interface CollectionExplorePageProps {}

const CollectionExplorePage: FC<CollectionExplorePageProps> = ({}) => {
  const { getCollectionsApi } = useCollectionsContext();

  const collections = useMemo(() => {
    return getCollectionsApi.data || [];
  }, [getCollectionsApi.data]);

  const pagination = usePagination({ count: collections.length });
  const select = useSelection<CollectionDetail>(collections);

  return (
    <>
      <div className="flex justify-between p-5 py-6 sticky top-0 z-10 bg-white">
        <CollectionBreadcrumb />
        <div></div>
      </div>
      <div className="px-4 flex-1 h-full">
        <CustomTable
          select={select}
          rows={collections}
          configs={collectionTableConfigs}
          pagination={pagination}
          hidePagination
        />
      </div>
      <div className="sticky bg-white flex bottom-0 px-7 justify-between py-2 border-t">
        <div className="flex text-sm text-gray-500 font-normal items-center overflow-hidden text-nowrap">
          Đang hiển thị kết quả thứ 1 tới 10 trên 97 kết quả
        </div>
        <Pagination {...pagination} onChange={pagination.onPageChange} />
      </div>
    </>
  );
};

export default CollectionExplorePage;
