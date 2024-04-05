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
import { useCallback, useEffect, useMemo } from "react";
import Loading from "src/components/Loading";

const BasicSearchResultPage = () => {
  const { getOrisonDetailApi } = useOrisonsContext();
  const router = useRouter();
  const getOrisonByIdApi = useFunction(OrisonsApi.getOrisonById);

  const pagination = usePagination({ count: 10 });

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
      console.log("searchKey", router.query.searchText);
      let savedString: string = orison?.plain_text || "";
      let searchText: string = router.query.searchText as string;
      let currentIndex: number = 0;
      let count: number = 0;
      const maxCount: number = 3;
      console.log("savedString", savedString);

      while (
        (currentIndex = savedString
          .toLowerCase()
          .indexOf(searchText.toLowerCase(), currentIndex)) !== -1 &&
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

  console.log("orison", orison);

  const handleBack = useCallback(() => {
    router.replace({
      pathname: router.pathname,
      query: { searchType: "basic" },
    });
  }, []);
  return (
    <div className="space-y-4 max-h-svh">
      <div className="flex justify-between p-5">
        <CollectionBreadcrumb />
        <Button variant={"ghost"} className="text-primary" onClick={handleBack}>
          Tìm kiếm kết quả khác
        </Button>
      </div>
      <div className="flex-1 min-h-0 bg-white flex gap-4 pl-4">
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
          <div className="flex flex-col gap-1 pt-4 px-2">
            {data.map((item) => (
              <div>{item}</div>
            ))}
            {/* {getOrisonsApi.data?.map((orison) => (
          <Button
            key={orison.id}
            variant="ghost"
            className={clsx(
              "w-full justify-start text-primary",
              orison.id == orisonId && "bg-accent"
            )}
            onClick={() => handleChangeOrison(orison.id)}
          >
            {orison.name}
          </Button>
        ))} */}
          </div>
        </div>
        <div className="border rounded-xl max-h-[calc(100vh-290px)] overflow-y-auto flex-1">
          {getOrisonByIdApi.loading ? (
            <Loading />
          ) : (
            <PlateEditor
              readOnly={true}
              initialValue={orison?.content}
              notes={orison?.notes}
              onUpdateNotes={() => {}}
              onChange={() => {}}
              // onSave={handleSave.call}
              // onCancel={handleCancel}
              //   searchText={searchText.toLowerCase()}
              setDataReport={() => {}}
              setSelectionReport={() => {}}
            />
          )}
        </div>
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

export default BasicSearchResultPage;
