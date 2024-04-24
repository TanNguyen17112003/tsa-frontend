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

const SearchResultPage = () => {
  const router = useRouter();
  const getOrisonByIdApi = useFunction(OrisonsApi.getOrisonById);
  const { goOrison } = useCollectionCategoriesContext();
  const [searchNum, setSearchNum] = useState(0);

  useEffect(() => {
    if (router.query.orisonId)
      getOrisonByIdApi.call(router.query.orisonId.toString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const orison = useMemo(() => {
    return getOrisonByIdApi.data;
  }, [getOrisonByIdApi.data]);

  const textSearch = useMemo(() => {
    const temp = router.query.textSearch?.toString()?.split("_");
    return temp
      ? router.query.searchType != "adjacent"
        ? temp[0]
        : temp[2]
      : "";
  }, [router.query.searchType, router.query.textSearch]);

  const dataSearch = useMemo(() => {
    const tempText = router.query.textSearch?.toString()?.split("_") || [];
    const temp: any[] = [];
    if (textSearch != "") {
      let savedString: string = orison?.plain_text || "";

      let currentIndex: number = 0;
      let count: number = 0;
      const maxCount: number = 3;
      if (router.query.searchType != "adjacent") {
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
      } else {
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
            .indexOf(tempText[3].toLowerCase());

          if (beforeIndex != -1 && afterIndex != -1) {
            temp.push({
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
    }
    return temp;
  }, [
    orison?.plain_text,
    router.query.searchType,
    router.query.textSearch,
    textSearch,
  ]);

  const handleBack = useCallback(() => {
    router.replace({
      pathname: router.pathname,
      query: {
        searchType: router.query.searchType,
        textSearch: router.query.textSearch,
      },
    });
  }, [router]);

  console.log("dataSearch", dataSearch);

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
            onClick={() => goOrison(router.query.orisonId?.toString() || "")}
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
                {router.query.searchType == "adjacent" ? (
                  <div className="space-x-0.5">
                    <span>{item?.text1}</span>
                    <span className="bg-blue-200">
                      {item?.beforeTextSearch}
                    </span>
                    <span>{item?.text2}</span>
                    <span className="bg-blue-200">{item?.textSearch}</span>
                    <span>{item?.text3}</span>
                    <span className="bg-blue-200">{item?.afterTextSearch}</span>
                    <span>{item?.text4}</span>
                  </div>
                ) : (
                  <div>
                    {item?.beforeTextSearch}
                    {item?.textSearch}
                    {item?.afterTextSearch}
                  </div>
                )}
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
              searchText={
                router.query.searchType != "adjacent"
                  ? textSearch?.toLowerCase()
                  : dataSearch[searchNum]?.beforeTextSearch +
                    (dataSearch[searchNum]?.beforeTextSearch == ""
                      ? ""
                      : dataSearch[searchNum]?.text2) +
                    dataSearch[searchNum]?.textSearch +
                    (dataSearch[searchNum]?.afterTextSearch == ""
                      ? ""
                      : dataSearch[searchNum]?.text3) +
                    dataSearch[searchNum]?.afterTextSearch
              }
              numElement={searchNum}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultPage;
