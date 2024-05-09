import { useCallback, useMemo, useState, type FC } from "react";
import CollectionBreadcrumb from "../../../CollectionBreadcrumb";
import AdvanceSearchForm from "./AdvanceSearchForm";
import { useRouter } from "next/router";
import AdvanceSearchResult from "./AdvanceSearchResult";

interface AdvanceSearchPageProps {}

const AdvanceSearchPage: FC<AdvanceSearchPageProps> = ({}) => {
  const router = useRouter();
  const textSearch = useMemo(() => {
    return router.query.textSearch as string;
  }, [router]);

  return (
    <>
      <div className="flex justify-between p-5">
        <CollectionBreadcrumb />
        <div></div>
      </div>
      <AdvanceSearchForm className={"py-4 px-6"} />
      {textSearch && textSearch != "" && <AdvanceSearchResult />}
    </>
  );
};

export default AdvanceSearchPage;
