import { Button } from "src/components/shadcn/ui/button";
import CollectionBreadcrumb from "../../../CollectionBreadcrumb";
import PlateEditor from "src/modules/Editor";
import { useOrisonsContext } from "src/contexts/orisons/orisons-context";
import Pagination from "src/components/ui/Pagination";
import usePagination from "src/hooks/use-pagination";
import getPaginationText from "src/utils/get-pagination-text";
import { useRouter } from "next/router";
import useFunction from "src/hooks/use-function";
import { OrisonsApi } from "src/api/orisons";
import { useCallback, useEffect, useMemo, useState } from "react";
import Loading from "src/components/Loading";
import { useCollectionCategoriesContext } from "src/contexts/collections/collection-categories-context";
import { cn } from "src/utils/shadcn";

const BasicSearchResultPage = () => {
  const router = useRouter();
  const getOrisonByIdApi = useFunction(OrisonsApi.getOrisonById);
  const { goOrison } = useCollectionCategoriesContext();
  const [searchNum, setSearchNum] = useState(0);
  const pagination = usePagination({ count: 10 });
  let searchText: string = router.query.searchText as string;

  useEffect(() => {
    getOrisonByIdApi.call(router.query.orisonId as string);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const orison = useMemo(() => {
    return getOrisonByIdApi.data;
  }, [getOrisonByIdApi.data]);

  const data = useMemo(() => {
    const temp: any[] = [];
    if (router.query.searchText != "") {
      let savedString: string = orison?.plain_text || "";

      let currentIndex: number = 0;
      let count: number = 0;
      const maxCount: number = 3;

      while (
        (currentIndex = savedString
          .toLowerCase()
          .indexOf(searchText?.toLowerCase(), currentIndex)) !== -1 &&
        count < maxCount
      ) {
        if (currentIndex < 30) {
          temp.push({
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
          temp.push({
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
    return temp;
  }, [orison]);

  const handleBack = useCallback(() => {
    router.replace({
      pathname: router.pathname,
      query: { searchType: "basic" },
    });
  }, []);
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
            {data.map((item, index) => (
              <div
                className={cn(
                  "flex space-x-4 border-b px-2 min-h-14 items-center cursor-pointer hover:bg-cyan-50",
                  searchNum == index ? "bg-cyan-50" : ""
                )}
                onClick={() => {
                  setSearchNum(index);
                }}
              >
                <div>{index + 1}</div>
                <div className="">
                  {item.firstText}
                  {item.secondText}
                  {item.thirdText}
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
              onUpdateNotes={() => {}}
              onChange={() => {}}
              searchText={searchText?.toLowerCase()}
              numElement={searchNum}
              setDataReport={() => {}}
              setSelectionReport={() => {}}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BasicSearchResultPage;
