import clsx from "clsx";
import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useMemo } from "react";
import { OrisonsApi } from "src/api/orisons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "src/components/shadcn/ui/accordion";
import Pagination from "src/components/ui/Pagination";
import { useCollectionCategoriesContext } from "src/contexts/collections/collection-categories-context";
import useFunction from "src/hooks/use-function";
import usePagination from "src/hooks/use-pagination";
import { getOrisonAdvanceSearch } from "src/modules/Collection/utils/search";
import getPaginationText from "src/utils/get-pagination-text";

interface AdvanceSearchResultProps {}

const AdvanceSearchResult: FC<AdvanceSearchResultProps> = ({}) => {
  const router = useRouter();
  const searchOrisonsApi = useFunction(OrisonsApi.searchOrisons);
  const { tree } = useCollectionCategoriesContext();

  const orisons = useMemo(() => {
    return searchOrisonsApi.data;
  }, [searchOrisonsApi]);

  const textSearchAdvance: string[] = useMemo(() => {
    if (typeof router.query.textSearch == "string") {
      return [router.query.textSearch];
    }
    return router.query.textSearch?.slice(1) || [];
  }, [router.query.textSearch]);

  const typeSearchAdvance: string[] = useMemo(() => {
    if (typeof router.query.optionSearch == "string") {
      return [router.query.optionSearch];
    }
    return router.query.optionSearch || [];
  }, [router.query.optionSearch]);

  const textSearch = useMemo(() => {
    if (typeof router.query.textSearch == "string") {
      return "";
    }
    return router.query.textSearch?.[0] || "";
  }, [router.query.textSearch]);

  const dataSearch = useMemo(() => {
    const result: { text: string; deco: boolean }[][][] = (
      orisons?.rows || []
    ).map((orison, index) =>
      getOrisonAdvanceSearch(orison.plain_text, {
        textSearch,
        textSearchAdvance,
        typeSearchAdvance,
      })
    );
    return result;
  }, [orisons?.rows, textSearch, textSearchAdvance, typeSearchAdvance]);

  const pagination = usePagination({ count: orisons?.count || 0 });

  const resultFrom = useMemo(() => {
    return (
      pagination.page * pagination.rowsPerPage + (pagination.count > 0 ? 1 : 0)
    );
  }, [pagination]);

  useEffect(() => {
    if (textSearch && textSearch != "") {
      const qResult: string[] = [];
      let textResult: string[] = [textSearch];
      let type = "and";
      textSearchAdvance.map((item, index) => {
        if (typeSearchAdvance[index] == "and" && item) {
          qResult.push(
            JSON.stringify({
              op: type,
              text: textResult,
              range: 0,
            })
          );
          textResult = [item];
          type = "and";
        } else if (typeSearchAdvance[index] == "not" && item) {
          qResult.push(
            JSON.stringify({
              op: type,
              text: textResult,
              range: 0,
            })
          );
          textResult = [item];
          type = "not";
        } else if (typeSearchAdvance[index] == "or" && item) {
          textResult.push(item);
        }
      });
      qResult.push(
        JSON.stringify({
          op: type,
          text: textResult,
          range: 0,
        })
      );
      searchOrisonsApi.call({
        q: qResult,
        limit: 10,
        offset: resultFrom - 1 < 0 ? 0 : resultFrom - 1,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, pagination.page]);

  console.log(resultFrom);

  const getCollectionName = useCallback(
    (volumeId: string) => {
      const sutraId = tree.volumes.find(
        (item) => item.id == volumeId
      )?.sutras_id;
      const collectionId = tree.sutras.find(
        (item) => item.id == sutraId
      )?.collection_id;
      return tree.collections.find((item) => item.id == collectionId)?.name;
    },
    [tree.collections, tree.sutras, tree.volumes]
  );

  const getSutraName = useCallback(
    (volumeId: string) => {
      const sutraId = tree.volumes.find(
        (item) => item.id == volumeId
      )?.sutras_id;
      return tree.sutras.find((item) => item.id == sutraId)?.name;
    },
    [tree.sutras, tree.volumes]
  );

  const handleClick = useCallback(
    (orisonId: string) => {
      router.replace({
        pathname: router.pathname,
        query: {
          ...router.query,
          orisonId: orisonId,
        },
      });
    },
    [router]
  );

  console.log("dataSearch", dataSearch);

  return (
    <div>
      <div className="pt-8 space-y-6 mb-10 px-6">
        {orisons && <div className="text-xl font-medium">Kết quả tìm kiếm</div>}
        <Accordion type="multiple" className="w-full">
          {orisons?.rows.map(
            (orison, orisonIndex) =>
              !searchOrisonsApi.loading && (
                <AccordionItem value={orison.id} key={orison.id}>
                  <AccordionTrigger className="flex bg-slate-200 p-4 rounded-md">
                    <div className="flex items-center space-x-6">
                      <div>{getCollectionName(orison.volume_id)}</div>
                      <div className="flex flex-col items-start">
                        <div className="text-base font-medium">
                          {getSutraName(orison.volume_id)}
                        </div>
                        <div className="text-sm font-normal text-gray-500">
                          {orison.name}
                        </div>
                      </div>
                    </div>
                    <div className="flex ml-auto text-xs font-medium text-blue-600 bg-blue-100 p-2 rounded-md border-blue-200 border mr-2">
                      {dataSearch[orisonIndex].length + " Kết quả phù hợp"}
                    </div>
                  </AccordionTrigger>
                  <div className="mb-6">
                    {dataSearch[orisonIndex].map((orisonTextDecos, index) => (
                      <AccordionContent
                        className="flex border-b border-x rounded-b-md pt-4 pl-4 space-x-8 text-base font-normal cursor-pointer hover:bg-slate-100"
                        onClick={() => {
                          handleClick(orison.id);
                        }}
                        key={index}
                      >
                        <div>
                          <span className="mr-2" key={index}>
                            {index + 1}.
                          </span>
                          {orisonTextDecos.map((orisonTextDeco, index) => (
                            <span
                              key={index}
                              className={clsx(
                                orisonTextDeco.deco && "bg-blue-200"
                              )}
                            >
                              {orisonTextDeco.text}
                            </span>
                          ))}
                        </div>
                      </AccordionContent>
                    ))}
                  </div>
                </AccordionItem>
              )
          )}
        </Accordion>
      </div>
      <div className="fixed bg-white flex bottom-0 px-7 justify-between py-2 w-[calc(100vw-280px)] border-t">
        <div className="flex text-sm text-gray-500 font-normal items-center overflow-hidden text-nowrap">
          {getPaginationText(pagination)}
        </div>
        <Pagination {...pagination} onChange={pagination.onPageChange} />
      </div>
    </div>
  );
};

export default AdvanceSearchResult;
