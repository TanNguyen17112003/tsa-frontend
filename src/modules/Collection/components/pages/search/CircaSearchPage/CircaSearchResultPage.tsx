import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CollectionsApi, SutraMin } from "src/api/collections";
import { SutrasApi } from "src/api/sutras";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "src/components/shadcn/ui/accordion";
import { useCollectionCategoriesContext } from "src/contexts/collections/collection-categories-context";
import useFunction from "src/hooks/use-function";
import { Sutra, SutraDetail } from "src/types/sutra";
import clsx from "clsx";
import { CustomTable } from "src/components/custom-table";
import getCircaSearchTableConfig from "src/sections/admin/circa-search/circa-search-table-config";
import { CircaSearchQuery } from "./CircaSearchForm";
import getCircaSearchResultTableConfig from "src/sections/admin/circa-search/circa-search-table-result-config";
import { useSelection } from "src/hooks/use-selection";
import CollectionBreadcrumb from "../../../CollectionBreadcrumb";
import { Button } from "src/components/shadcn/ui/button";

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
  }, [qCircaTo, qCircaFrom]);

  const sutras = useMemo(() => {
    return getSutrasApi.data || [];
  }, [getSutrasApi]);

  const CircaSearchResultTableConfig = useMemo(() => {
    return getCircaSearchResultTableConfig({
      onClickEdit: (data) => {},
    });
  }, []);

  const backToSearchCirca = () => {
    router.replace({
      pathname: router.pathname,
      query: "searchType=circa",
    });
  };

  const select = useSelection<SutraMin>(sutras);

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
          configs={CircaSearchResultTableConfig}
          select={select}
          onClickRow={(row) => goSutra(row.id)}
        ></CustomTable>
      </div>
    </div>
  );
};

export default CircaSearchResultPage;
