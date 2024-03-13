import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CollectionsApi } from "src/api/collections";
import { SutrasApi } from "src/api/sutras";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "src/components/shadcn/ui/accordion";
import { useCollectionCategoriesContext } from "src/contexts/collections/collection-categories-context";
import useFunction from "src/hooks/use-function";
import { Sutra } from "src/types/sutra";
import clsx from "clsx";
import { CustomTable } from "src/components/custom-table";
import getCircaSearchTableConfig from "src/sections/admin/circa-search/circa-search-table-config";
import { CircaSearchQuery } from "./CircaSearchForm";

const CircaSearchResultPage = ({ qCirca }: { qCirca?: CircaSearchQuery }) => {
  const getCollectionsApi = useFunction(CollectionsApi.getCollections);
  const getSutrasApi = useFunction(SutrasApi.getSutras);
  const [data, setData] = useState<Sutra[]>();

  const router = useRouter();
  const { goSutra } = useCollectionCategoriesContext();

  useEffect(() => {
    getCollectionsApi.call({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const collection = useMemo(() => {
    return getCollectionsApi.data || [];
  }, [getCollectionsApi.data]);

  const getSutra = (id: string) => {
    getSutrasApi.call({ collection_id: id });
    return getSutrasApi.data || [];
  };

  const handleClick = useCallback(
    (id: string) => {
      goSutra(id);
    },
    [goSutra]
  );
  return (
    <>
      <div className="font-medium text-lg pt-8">Niên đại bộ kinh</div>
      <div className="pt-4">
        <Accordion type="multiple" value={["collection"]} className="">
          {collection.map((item) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className="border-b-0 "
            >
              <AccordionTrigger
                className={
                  "font-semibold fill-primary px-2 bg-slate-200 rounded-t-md"
                }
                onClick={(e) => {
                  const temp = getSutra(item.id).filter((t) => {
                    return (
                      t.circa.start_year >=
                        parseInt(qCirca?.qCircaFrom || "0") &&
                      t.circa.end_year <= parseInt(qCirca?.qCircaTo || "0")
                    );
                  });
                  if (JSON.stringify(temp) === JSON.stringify(data))
                    setData(undefined);
                  else setData(temp);
                }}
              >
                {item.name}
              </AccordionTrigger>
              {data && (
                <CustomTable
                  rows={data}
                  configs={getCircaSearchTableConfig}
                  onClickRow={(e) => handleClick(e.id)}
                />
              )}
              {/* <AccordionContent>
                <SutraItems collectionId={item.id} />
              </AccordionContent> */}
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </>
  );
};

export default CircaSearchResultPage;
