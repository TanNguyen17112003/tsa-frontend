import { FC, useCallback, useEffect, useMemo, useState } from "react";
import CollectionBreadcrumb from "../../../CollectionBreadcrumb";
import CircaSearchForm, { CircaSearchQuery } from "./CircaSearchForm";
import { useRouter } from "next/router";
import { CustomTable } from "src/components/custom-table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "src/components/shadcn/ui/accordion";
import { useCollectionCategoriesContext } from "src/contexts/collections/collection-categories-context";
import getCircaSearchTableConfig from "src/sections/admin/circa-search/circa-search-table-config";

interface CircaSearchPageProps {}

const CircaSearchPage: FC<CircaSearchPageProps> = ({}) => {
  const router = useRouter();
  const [qCirca, setQCirca] = useState<CircaSearchQuery>();
  const { tree } = useCollectionCategoriesContext();

  const sutras = useMemo(() => {
    return (
      tree?.sutras?.filter((t) => {
        return (
          t.circa.start_year >= parseInt(qCirca?.qCircaFrom || "0") &&
          t.circa.end_year <= parseInt(qCirca?.qCircaTo || "0")
        );
      }) || []
    );
  }, [qCirca?.qCircaFrom, qCirca?.qCircaTo, tree?.sutras]);
  const collection = useMemo(() => {
    return tree?.collections || [];
  }, [tree]);

  const handleClick = useCallback(
    (row: any) => {
      router.replace({
        pathname: router.pathname,
        query: {
          ...router.query,
          qCircaFrom: row.circa.start_year,
          qCircaTo: row.circa.end_year,
        },
      });
    },
    [router]
  );

  useEffect(() => {
    router.replace({
      pathname: router.pathname,
      query: { searchType: "circa" },
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <div className="flex justify-between p-5">
        <CollectionBreadcrumb />
      </div>
      <hr />
      <div className="p-6">
        <div className="max-w-[928px] mx-auto">
          <CircaSearchForm
            setQCirca={(values) => {
              setQCirca(values);
            }}
          />
          <div className="font-medium text-lg pt-8">Niên đại bộ kinh</div>
          <div className="pt-4">
            <Accordion type="multiple" className="w-full">
              {collection.map((item, index) => {
                const collectionSutras = sutras.filter(
                  (s) => s.collection_id == item.id
                );
                if (collectionSutras.length == 0) {
                  return <div key={item.id} />;
                }
                return (
                  <AccordionItem value={item.name} key={index} className="mb-2">
                    <AccordionTrigger className="bg-slate-200 p-4 rounded-t-md">
                      {item.name}
                    </AccordionTrigger>
                    <AccordionContent>
                      <CustomTable
                        rows={collectionSutras}
                        configs={getCircaSearchTableConfig}
                        onClickRow={(e) => handleClick(e)}
                      />
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </div>
      </div>
    </>
  );
};

export default CircaSearchPage;
