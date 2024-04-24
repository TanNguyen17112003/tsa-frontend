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
import getPaginationText from "src/utils/get-pagination-text";

interface BasicSearchResultProps {}

const BasicSearchResult: FC<BasicSearchResultProps> = ({}) => {
  const router = useRouter();
  const searchOrisonsApi = useFunction(OrisonsApi.searchOrisons);
  const { tree } = useCollectionCategoriesContext();
  const orisons = useMemo(() => {
    return searchOrisonsApi.data;
  }, [searchOrisonsApi]);

  const textSearch = useMemo(() => {
    return router.query.textSearch as string;
  }, [router]);

  const dataSearch = useMemo(() => {
    const temp: any[][] = [];
    orisons?.rows.map((item, index) => {
      temp[index] = [];
      if (textSearch != "") {
        let savedString: string = item.plain_text;
        let currentIndex: number = 0;
        let count: number = 0;
        const maxCount: number = 3;

        while (
          (currentIndex = savedString
            .toLowerCase()
            .indexOf(textSearch?.toLowerCase(), currentIndex)) !== -1 &&
          count < maxCount
        ) {
          if (currentIndex < 15) {
            temp[index].push({
              beforeTextSearch: savedString.substring(0, currentIndex),
              textSearch: savedString.substring(
                currentIndex,
                currentIndex + textSearch.length
              ),
              afterTextSearch: savedString.substring(
                currentIndex + textSearch.length,
                textSearch.length + 15
              ),
            });
            count++;
          } else if (currentIndex > savedString.length - 14) {
            temp[index].push({
              beforeTextSearch: savedString.substring(
                currentIndex - 15,
                currentIndex
              ),
              textSearch: savedString.substring(
                currentIndex,
                currentIndex + textSearch.length
              ),
              afterTextSearch: savedString.substring(
                currentIndex + textSearch.length,
                savedString.length
              ),
            });
            count++;
          } else {
            temp[index].push({
              beforeTextSearch: savedString.substring(
                currentIndex - 15,
                currentIndex
              ),
              textSearch: savedString.substring(
                currentIndex,
                currentIndex + textSearch.length
              ),
              afterTextSearch: savedString.substring(
                currentIndex + textSearch.length,
                currentIndex + textSearch.length + 15
              ),
            });
            count++;
          }
          currentIndex += textSearch.length;
        }
      }
    });
    return temp;
  }, [orisons?.rows, textSearch]);

  const pagination = usePagination({ count: orisons?.count || 0 });

  useEffect(() => {
    searchOrisonsApi.call({
      q: [
        JSON.stringify({
          op: "and",
          text: [textSearch],
          range: 0,
        }),
      ],
      limit: 10,
      offset: resultFrom - 1 < 0 ? 0 : resultFrom - 1,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textSearch, pagination.page]);

  const resultFrom = useMemo(() => {
    return (
      pagination.page * pagination.rowsPerPage + (pagination.count > 0 ? 1 : 0)
    );
  }, [pagination]);

  const resultTo = useMemo(() => {
    return Math.min(
      pagination.count,
      pagination.rowsPerPage * (pagination.page + 1)
    );
  }, [pagination]);

  const getCollectionName = (volumeId: string) => {
    const sutraId = tree.volumes.find((item) => item.id == volumeId)?.sutras_id;
    const collectionId = tree.sutras.find(
      (item) => item.id == sutraId
    )?.collection_id;
    return tree.collections.find((item) => item.id == collectionId)?.name;
  };

  const getSutraName = (volumeId: string) => {
    const sutraId = tree.volumes.find((item) => item.id == volumeId)?.sutras_id;
    return tree.sutras.find((item) => item.id == sutraId)?.name;
  };

  const handleClick = useCallback(
    (orisonId: string, textSearch: string) => {
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

  return (
    <div>
      <div className="pt-8 space-y-6 mb-10 px-6">
        {orisons && <div className="text-xl font-medium">Kết quả tìm kiếm</div>}
        <Accordion type="multiple" className="w-full">
          {orisons?.rows.map(
            (item, index) =>
              !searchOrisonsApi.loading && (
                <AccordionItem value={item.id} key={index}>
                  <AccordionTrigger className="flex bg-slate-200 p-4 rounded-md">
                    <div className="flex items-center space-x-6">
                      <div>{getCollectionName(item.volume_id)}</div>
                      <div className="flex flex-col items-start">
                        <div className="text-base font-medium">
                          {getSutraName(item.volume_id)}
                        </div>
                        <div className="text-sm font-normal text-gray-500">
                          {item.name}
                        </div>
                      </div>
                    </div>
                    <div className="flex ml-auto text-xs font-medium text-blue-600 bg-blue-100 p-2 rounded-md border-blue-200 border mr-2">
                      {dataSearch[index].length + " Kết quả phù hợp"}
                    </div>
                  </AccordionTrigger>
                  <div className="mb-6">
                    {dataSearch[index].map((d, index) => (
                      <AccordionContent
                        className="flex border-b border-x rounded-b-md pt-4 pl-4 space-x-8 text-base font-normal cursor-pointer hover:bg-slate-100"
                        onClick={() => {
                          handleClick(item.id, textSearch);
                        }}
                        key={index}
                      >
                        <div>{index + 1}</div>
                        <div className="flex">
                          {d.beforeTextSearch[d.beforeTextSearch.length - 1] !=
                          " " ? (
                            <div>{d.beforeTextSearch}</div>
                          ) : (
                            <div className="mr-0.5">{d.beforeTextSearch}</div>
                          )}
                          <div className="bg-blue-200">{d.textSearch}</div>
                          {d.afterTextSearch[0] != " " ? (
                            <div>{d.afterTextSearch}</div>
                          ) : (
                            <div className="ml-0.5">{d.afterTextSearch}</div>
                          )}
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

export default BasicSearchResult;
