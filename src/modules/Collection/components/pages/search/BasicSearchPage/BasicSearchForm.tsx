import { useRouter } from "next/router";
import { useMemo, type FC, useCallback, useEffect, useState } from "react";
import CustomSelect from "src/components/CustomSelect/CustomSelect";
import { Button } from "src/components/shadcn/ui/button";
import FormInput from "src/components/ui/FormInput";
import searchTypes from "src/modules/Collection/constants/searchTypes";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "src/components/shadcn/ui/accordion";
import Pagination from "src/components/ui/Pagination";
import usePagination from "src/hooks/use-pagination";
import getPaginationText from "src/utils/get-pagination-text";
import useFunction from "src/hooks/use-function";
import { OrisonsApi } from "src/api/orisons";
import { useCollectionCategoriesContext } from "src/contexts/collections/collection-categories-context";

interface BasicSearchFormProps {
  className: string;
}

const BasicSearchForm: FC<BasicSearchFormProps> = ({ className }) => {
  const router = useRouter();
  const currentSearchType = router.query.searchType;
  const searchOrisonsApi = useFunction(OrisonsApi.searchOrisons);
  const { tree } = useCollectionCategoriesContext();
  const [searchKey, setSearchKey] = useState<string>("");

  const handleChange = useCallback(
    (value: string) => {
      const newQuery: any = {};
      Object.keys(router.query).forEach((key) =>
        key.startsWith("q") ? null : (newQuery[key] = router.query[key])
      );
      router.replace({
        pathname: router.pathname,
        query: { ...newQuery, searchType: value },
      });
    },
    [router]
  );

  const acceptSearchTypes = useMemo(
    () =>
      searchTypes.filter((searchType) =>
        ["basic", "advance", "adjacent"].includes(searchType.value)
      ),
    []
  );
  const orisons = useMemo(() => {
    return searchOrisonsApi.data;
  }, [searchOrisonsApi]);

  const data = useMemo(() => {
    const temp: any[][] = [];
    orisons?.rows.map((item, index) => {
      temp[index] = [];
      if (searchKey != "") {
        let savedString: string = item.plain_text;
        let searchText: string = searchKey;
        let currentIndex: number = 0;
        let count: number = 0;
        const maxCount: number = 3;

        while (
          (currentIndex = savedString
            .toLowerCase()
            .indexOf(searchText.toLowerCase(), currentIndex)) !== -1 &&
          count < maxCount
        ) {
          if (currentIndex < 30) {
            temp[index]?.push({
              firstText: "",
              secondText: savedString.substring(
                currentIndex,
                currentIndex + searchText.length
              ),
              thirdText: savedString.substring(
                currentIndex + searchText.length,
                currentIndex + 30
              ),
            });
            count++;
          } else {
            temp[index]?.push({
              firstText: savedString.substring(currentIndex - 30, currentIndex),
              secondText: savedString.substring(
                currentIndex,
                currentIndex + searchText.length
              ),
              thirdText: "",
            });
            count++;
          }
          currentIndex += searchText.length;
        }
      }
    });
    return temp;
  }, [orisons]);
  const pagination = usePagination({ count: orisons?.count || 0 });

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
    (orisonId: string, searchText: string) => {
      router.replace({
        pathname: router.pathname,
        query: {
          ...router.query,
          orisonId: orisonId,
          searchText: searchText,
        },
      });
    },
    [router]
  );

  return (
    <div>
      <form className={className}>
        <div className="flex gap-4">
          <div className="flex items-center border border-gray-300 rounded-md w-full divide-x">
            <div className="flex w-full items-center">
              <FormInput
                type="text"
                placeholder="Nhập từ khóa tìm kiếm..."
                className="border-none"
                id="search"
              />
            </div>
            <CustomSelect
              options={acceptSearchTypes}
              value={currentSearchType ? currentSearchType.toString() : ""}
              onValueChange={handleChange}
              className="border-none"
            />
          </div>
          <Button
            type="button"
            onClick={() => {
              const searchInput: HTMLInputElement = document.getElementById(
                "search"
              ) as HTMLInputElement;
              const searchValue = searchInput?.value;
              setSearchKey(searchValue);
              searchOrisonsApi.call({
                q: searchValue,
                limit: 10,
                offset: 0,
              });
            }}
          >
            {" "}
            Tìm kiếm
          </Button>
        </div>
        <div className="pt-8 space-y-6 mb-10">
          {orisons && (
            <div className="text-xl font-medium">Kết quả tìm kiếm</div>
          )}
          <Accordion type="multiple" className="w-full">
            {orisons?.rows.map(
              (item, index) =>
                index <= resultTo - 1 &&
                resultFrom - 1 <= index &&
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
                        {data[index].length + " Kết quả phù hợp"}
                      </div>
                    </AccordionTrigger>
                    <div className="mb-6">
                      {data[index].map((d, index) => (
                        <AccordionContent
                          className="flex border-b border-x rounded-b-md pt-4 pl-4 space-x-8 text-base font-normal cursor-pointer hover:bg-slate-100"
                          onClick={() => {
                            handleClick(item.id, searchKey);
                          }}
                        >
                          <div>{index + 1}</div>
                          <div className="flex space-x-0.5">
                            <div>{d.firstText}</div>
                            <div className="bg-blue-200">{d.secondText}</div>
                            <div>{d.thirdText}</div>
                          </div>
                        </AccordionContent>
                      ))}
                    </div>
                  </AccordionItem>
                )
            )}
          </Accordion>
        </div>
      </form>

      <div className="fixed bg-white flex bottom-0 px-7 justify-between py-2 w-[calc(100vw-280px)] border-t">
        <div className="flex text-sm text-gray-500 font-normal items-center overflow-hidden text-nowrap">
          {getPaginationText(pagination)}
        </div>
        <Pagination {...pagination} onChange={pagination.onPageChange} />
      </div>
    </div>
  );
};

export default BasicSearchForm;
