import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { SutrasApi } from "src/api/sutras";
import { useCollectionCategoriesContext } from "src/contexts/collections/collection-categories-context";
import useFunction from "src/hooks/use-function";
import { CustomTable } from "src/components/custom-table";
import getCircaSearchResultTableConfig from "src/sections/admin/circa-search/circa-search-table-result-config";
import { useSelection } from "src/hooks/use-selection";
import CollectionBreadcrumb from "../../../CollectionBreadcrumb";
import { Button } from "src/components/shadcn/ui/button";
import { Sutra } from "src/types/sutra";

const CircaSearchResultPage = ({
  qCircaFrom,
  qCircaTo,
}: {
  qCircaFrom?: string;
  qCircaTo?: string;
}) => {
  const getSutrasApi = useFunction(SutrasApi.getSutras);
  const { goSutra } = useCollectionCategoriesContext();
  const router = useRouter();
  useEffect(() => {
    getSutrasApi.call({
      qCircaFrom: qCircaFrom,
      qCircaTo: qCircaTo,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sutras = useMemo(() => {
    return getSutrasApi.data || [];
  }, [getSutrasApi]);

  const circaSearchResultTableConfig = useMemo(() => {
    return getCircaSearchResultTableConfig({
      onClickEdit: (data) => {},
    });
  }, []);

  const backToSearchCirca = () => {
    router.replace({
      pathname: router.pathname,
      query: { searchType: "circa" },
    });
  };

  // const select = useSelection<Sutra>(sutras);

  return (
    <div>
      <div className="flex justify-between p-5">
        <CollectionBreadcrumb />
        <div className="flex space-x-4">
          <Button variant="outline" onClick={backToSearchCirca}>
            Tìm kiếm kết quả khác
          </Button>
        </div>
      </div>
      <div className="p-6">
        <CustomTable
          rows={sutras}
          configs={circaSearchResultTableConfig}
          // select={select}
          onClickRow={(row) => goSutra(row.id)}
        ></CustomTable>
      </div>
    </div>
  );
};

export default CircaSearchResultPage;
