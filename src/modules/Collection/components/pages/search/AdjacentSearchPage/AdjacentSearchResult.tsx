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

interface AdjacentSearchResultProps {}

const AdjacentSearchResult: FC<AdjacentSearchResultProps> = ({}) => {
  const router = useRouter();
  const searchOrisonsApi = useFunction(OrisonsApi.searchOrisons);
  const { tree } = useCollectionCategoriesContext();
  const orisons = useMemo(() => {
    return searchOrisonsApi.data;
  }, [searchOrisonsApi]);

  const textSearch = useMemo(() => {
    return router.query.textSearch?.toString();
  }, [router]);

  const dataSearch = useMemo(() => {
    const tempText = textSearch?.split("_");
    const temp: any[][] = [];
    orisons?.rows.map((item, index) => {
      temp[index] = [];
      if (tempText && tempText[2] != "") {
        let savedString: string = item.plain_text;
        let currentIndex: number = 0;
        let count: number = 0;
        const maxCount: number = 3;

        while (
          (currentIndex = savedString
            .toLowerCase()
            .indexOf(tempText[2]?.toLowerCase(), currentIndex)) !== -1 &&
          count < maxCount
        ) {
          const beforeIndex = savedString
            .toLowerCase()
            .substring(
              currentIndex - parseInt(tempText[1]) > 0
                ? currentIndex - parseInt(tempText[1])
                : 0,
              currentIndex
            )
            .indexOf(tempText[0].toLowerCase());

          const afterIndex = savedString
            .toLowerCase()
            .substring(
              currentIndex + tempText[2].length,
              parseInt(tempText[4]) + currentIndex + tempText[2].length <
                savedString.length
                ? parseInt(tempText[4]) + currentIndex + tempText[2].length
                : savedString.length
            )
            .indexOf(tempText[3]?.toLowerCase());

          if (beforeIndex != -1 && afterIndex != -1) {
            temp[index].push({
              text1: savedString.substring(
                currentIndex - 30 - parseInt(tempText[1]),
                currentIndex - parseInt(tempText[1]) + beforeIndex
              ),
              beforeTextSearch: savedString.substring(
                currentIndex - parseInt(tempText[1]) + beforeIndex,
                currentIndex -
                  parseInt(tempText[1]) +
                  beforeIndex +
                  tempText[0].length
              ),
              text2: savedString.substring(
                currentIndex -
                  parseInt(tempText[1]) +
                  beforeIndex +
                  tempText[0].length,
                currentIndex
              ),
              textSearch: savedString.substring(
                currentIndex,
                currentIndex + tempText[2].length
              ),
              text3: savedString.substring(
                currentIndex + tempText[2].length,
                currentIndex + tempText[2].length + afterIndex
              ),
              afterTextSearch: savedString.substring(
                currentIndex + tempText[2].length + afterIndex,
                currentIndex +
                  tempText[2].length +
                  afterIndex +
                  tempText[3].length
              ),
              text4: savedString.substring(
                currentIndex +
                  tempText[2].length +
                  afterIndex +
                  tempText[3].length,
                currentIndex + tempText[2].length + 30 + parseInt(tempText[4])
              ),
            });
            count++;
          }
          currentIndex += tempText[2].length;
        }
      }
    });
    return temp;
  }, [orisons?.rows, textSearch]);

  const pagination = usePagination({ count: orisons?.count || 0 });

  useEffect(() => {
    const temp = textSearch?.split("_");
    if (temp)
      searchOrisonsApi.call({
        q: [
          JSON.stringify({
            op: "and",
            text: [temp[0]],
            range: parseInt(temp[1]),
          }),
          JSON.stringify({
            op: "and",
            text: [temp[2]],
            range: 0,
          }),
          JSON.stringify({
            op: "and",
            text: [temp[3]],
            range: parseInt(temp[4]),
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
                          handleClick(item.id);
                        }}
                        key={index}
                      >
                        <div>{index + 1}</div>
                        <div className="space-x-0.5">
                          <span>{d.text1}</span>
                          <span className="bg-blue-200">
                            {d.beforeTextSearch}
                          </span>
                          <span>{d.text2}</span>
                          <span className="bg-blue-200">{d.textSearch}</span>
                          <span>{d.text3}</span>
                          <span className="bg-blue-200">
                            {d.afterTextSearch}
                          </span>
                          <span>{d.text4}</span>
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

export default AdjacentSearchResult;
