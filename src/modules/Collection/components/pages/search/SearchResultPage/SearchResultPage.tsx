import { Button } from "src/components/shadcn/ui/button";
import CollectionBreadcrumb from "../../../CollectionBreadcrumb";
import PlateEditor from "src/modules/Editor";
import { useRouter } from "next/router";
import useFunction from "src/hooks/use-function";
import { OrisonsApi } from "src/api/orisons";
import { useCallback, useEffect, useMemo, useState } from "react";
import Loading from "src/components/Loading";
import { useCollectionCategoriesContext } from "src/contexts/collections/collection-categories-context";
import { cn } from "src/utils/shadcn";

const AdvanceSearchResultPage = () => {
  const router = useRouter();
  const getOrisonByIdApi = useFunction(OrisonsApi.getOrisonById);
  const { goOrison } = useCollectionCategoriesContext();
  const [searchNum, setSearchNum] = useState(0);

  useEffect(() => {
    getOrisonByIdApi.call(router.query.orisonId as string);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const orison = useMemo(() => {
    return getOrisonByIdApi.data;
  }, [getOrisonByIdApi.data]);

  const textSearch = useMemo(() => {
    const temp = (router.query.textSearch as string)?.split("_");
    return temp[0] as string;
  }, [router.query.textSearch]);

  const dataSearch = useMemo(() => {
    const temp: any[] = [];
    if (textSearch != "") {
      let savedString: string = orison?.plain_text || "";

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
          temp.push({
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
          temp.push({
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
          temp.push({
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
    return temp;
  }, [orison?.plain_text, textSearch]);

  const handleBack = useCallback(() => {
    router.replace({
      pathname: router.pathname,
      query: {
        searchType: router.query.searchType,
        textSearch: router.query.textSearch,
      },
    });
  }, [router]);
  return (
    <div className="space-y-4 max-h-[calc(100vh-230px)]">
      <div className="flex justify-between p-5">
        <CollectionBreadcrumb />
        <div>
          <Button
            variant={"ghost"}
            className="text-primary"
            onClick={handleBack}
          >
            Tìm kiếm kết quả khác
          </Button>
          <Button
            variant={"default"}
            onClick={() => goOrison(router.query.orisonId as string)}
          >
            Xem văn bản gốc
          </Button>
        </div>
      </div>
      <div className="flex-1 min-h-0 h-full bg-white flex gap-4 pl-4">
        <div className="w-1/6 border rounded-xl">
          <div className="sticky top-0 bg-white">
            <div className="p-3 text-lg font-semibold text-text-secondary ">
              Danh sách kết quả
            </div>
            <hr />
            <div className="p-3 text-base font-medium text-text-secondary ">
              <div></div>
              <div></div># Nội dung
            </div>
            <hr />
          </div>
          <div className="flex flex-col gap-1">
            {dataSearch.map((item, index) => (
              <div
                className={cn(
                  "flex space-x-4 border-b px-2 min-h-14 items-center cursor-pointer hover:bg-cyan-50",
                  searchNum == index ? "bg-cyan-50" : ""
                )}
                onClick={() => {
                  setSearchNum(index);
                }}
                key={index}
              >
                <div>{index + 1}</div>
                <div className="">
                  {item.beforeTextSearch}
                  {item.textSearch}
                  {item.afterTextSearch}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="border h-full rounded-xl overflow-y-auto flex-1">
          {getOrisonByIdApi.loading ? (
            <Loading />
          ) : (
            <PlateEditor
              readOnly={true}
              initialValue={orison?.content}
              notes={orison?.notes}
              searchText={textSearch?.toLowerCase()}
              numElement={searchNum}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvanceSearchResultPage;
