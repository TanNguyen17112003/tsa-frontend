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
  const data: any[] = [
    {
      name: "data1",
    },
    {
      name: "data2",
    },
    {
      name: "data3",
    },
  ];
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
                onChange={(value: any) => setSearchKey(value.nativeEvent.data)}
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
              searchOrisonsApi.call({
                q: searchKey,
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
          <div className="text-xl font-medium">Kết quả tìm kiếm</div>
          <Accordion type="multiple" className="w-full">
            {orisons?.rows.map(
              (item, index) =>
                index <= resultTo - 1 &&
                resultFrom - 1 <= index && (
                  <AccordionItem value={item.id} key={index}>
                    <AccordionTrigger className="flex bg-slate-100 p-4 rounded-md">
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
                        {data.length + " Kết quả phù hợp"}
                      </div>
                    </AccordionTrigger>
                    <div className="mb-6">
                      {data.map((d, index) => (
                        <AccordionContent className="flex border-b border-x rounded-b-md pt-4 pl-4 space-x-8 text-base font-normal">
                          <div>{index + 1}</div>
                          <div>{d.name}</div>
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
