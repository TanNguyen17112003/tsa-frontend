import { FC, useCallback, useEffect, useMemo, useState } from "react";
import CollectionBreadcrumb from "../../../CollectionBreadcrumb";
import CircaSearchForm, { CircaSearchQuery } from "./CircaSearchForm";
import CircaSearchResultPage from "./CircaSearchResultPage";
import { useRouter } from "next/router";
import { CustomTable } from "src/components/custom-table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "src/components/shadcn/ui/accordion";
import useFunction from "src/hooks/use-function";
import { Sutra } from "src/types/sutra";
import { CollectionsApi } from "src/api/collections";
import { SutrasApi } from "src/api/sutras";
import { useCollectionCategoriesContext } from "src/contexts/collections/collection-categories-context";
import getCircaSearchTableConfig from "src/sections/admin/circa-search/circa-search-table-config";
import { Button } from "src/components/shadcn/ui/button";

interface CircaSearchPageProps {}

const CircaSearchPage: FC<CircaSearchPageProps> = ({}) => {
  const router = useRouter();
  const [qCirca, setQCirca] = useState<CircaSearchQuery>();
  const getCollectionsApi = useFunction(CollectionsApi.getCollections);
  const getSutrasApi = useFunction(SutrasApi.getSutras);
  const [data, setData] = useState<Sutra[]>();
  const [index, setIndex] = useState<string>("");
  const [status, setStatus] = useState<boolean>(true);

  const { goSutra } = useCollectionCategoriesContext();

  useEffect(() => {
    getCollectionsApi.call({});
    if (index) {
      const temp = getSutra.filter((t) => {
        return (
          t.circa.start_year >= parseInt(qCirca?.qCircaFrom || "0") &&
          t.circa.end_year <= parseInt(qCirca?.qCircaTo || "0")
        );
      });
      setData(temp);
      setStatus(!status);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qCirca]);

  const collection = useMemo(() => {
    return getCollectionsApi.data || [];
  }, [getCollectionsApi.data]);

  useEffect(() => {
    if (index.length != 0) getSutrasApi.call({ collection_id: index });
  }, [status]);

  const getSutra = useMemo(() => {
    return getSutrasApi.data || [];
  }, [getSutrasApi.data]);

  const handleClick = useCallback(
    (id: string) => {
      router.replace({
        pathname: router.pathname,
        query: { ...router.query, sutraId: id },
      });
      // goSutra(id);
    },
    [goSutra]
  );

  useEffect(() => {
    router.replace({
      pathname: router.pathname,
      query: "searchType=circa",
    });
  }, []);
  return (
    <>
      <div className="flex justify-between p-5">
        <CollectionBreadcrumb />
        <div className="flex space-x-4">
          <Button variant="outline">Tìm kiếm kết quả khác</Button>
          <Button variant="default">Đi đến trang này</Button>
        </div>
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
                    onClick={() => {
                      setStatus(!status);
                      const temp = getSutra.filter((t) => {
                        return (
                          t.circa.start_year >=
                            parseInt(qCirca?.qCircaFrom || "0") &&
                          t.circa.end_year <= parseInt(qCirca?.qCircaTo || "0")
                        );
                      });

                      if (
                        JSON.stringify(temp) === JSON.stringify(data) &&
                        index == item.id
                      ) {
                        setData(undefined);
                        setIndex("");
                      } else {
                        setData(temp);
                        setIndex(item.id);
                      }
                    }}
                  >
                    {item.name}
                  </AccordionTrigger>
                  {data && index == item.id && (
                    <CustomTable
                      rows={data}
                      configs={getCircaSearchTableConfig}
                      onClickRow={(e) => handleClick(e.id)}
                    />
                  )}
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </>
  );
};

export default CircaSearchPage;
