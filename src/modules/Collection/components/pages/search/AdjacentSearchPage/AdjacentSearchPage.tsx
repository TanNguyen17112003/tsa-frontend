import { useMemo, type FC } from "react";
import CollectionBreadcrumb from "../../../CollectionBreadcrumb";
import AdjacentSearchForm from "./AdjacentSearchForm";
import { useRouter } from "next/router";
import AdjacentSearchResult from "./AdjacentSearchResult";

interface AdjacentSearchPageProps {}

const AdjacentSearchPage: FC<AdjacentSearchPageProps> = ({}) => {
  const router = useRouter();
  const textSearch = useMemo(() => {
    return router.query.textSearch as string;
  }, [router.query.textSearch]);

  return (
    <>
      <div className="flex justify-between p-5">
        <CollectionBreadcrumb />
        <div></div>
      </div>
      <AdjacentSearchForm className={"py-4 px-6"} />
      {textSearch && textSearch != "" && <AdjacentSearchResult />}
    </>
  );
};

export default AdjacentSearchPage;
