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
import {
  getOrisonAdjacentSearch,
  getOrisonAdvanceSearch,
} from "src/modules/Collection/utils/search";
import clsx from "clsx";

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

  const adjacentTextSearch = useMemo(() => {
    return router.query.textSearch?.toString();
  }, [router]);

  const dataSearch = useMemo(() => {
    if (!orison) {
      return [[]];
    }

    if (textSearch != "") {
      if (router.query.searchType != "adjacent") {
        return getOrisonAdvanceSearch(orison.plain_text, {
          textSearch,
          textSearchAdvance,
          typeSearchAdvance,
        });
      } else {
        return getOrisonAdjacentSearch(
          orison.plain_text,
          adjacentTextSearch || ""
        );
      }
    }
  }, [
    adjacentTextSearch,
    orison,
    router.query.searchType,
    textSearch,
    textSearchAdvance,
    typeSearchAdvance,
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
            {dataSearch?.map((orisonTextDecos, index) => (
              <div
                className={cn(
                  "border-b px-2 min-h-14 items-center cursor-pointer hover:bg-cyan-50",
                  searchNum == index ? "bg-cyan-50" : ""
                )}
                onClick={() => {
                  setSearchNum(index);
                }}
                key={index}
              >
                <div>{index + 1}</div>
                {orisonTextDecos.map((orisonTextDeco, index) => (
                  <span
                    key={index}
                    className={clsx(orisonTextDeco.deco && "bg-blue-200")}
                  >
                    {orisonTextDeco.text}
                  </span>
                ))}
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
              // searchText={
              //   router.query.searchType != "adjacent"
              //     ? textSearch?.toLowerCase()
              //     : dataSearch[searchNum]?.beforeTextSearch?.toLowerCase() +
              //       (dataSearch[searchNum]?.beforeTextSearch?.toLowerCase() ==
              //       ""
              //         ? ""
              //         : dataSearch[searchNum]?.text2?.toLowerCase()) +
              //       dataSearch[searchNum]?.textSearch?.toLowerCase() +
              //       (dataSearch[searchNum]?.afterTextSearch?.toLowerCase() == ""
              //         ? ""
              //         : dataSearch[searchNum]?.text3?.toLowerCase()) +
              //       dataSearch[searchNum]?.afterTextSearch?.toLowerCase()
              // }
              numElement={searchNum}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultPage;
