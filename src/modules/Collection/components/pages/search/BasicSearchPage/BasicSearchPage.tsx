import { FC, useMemo } from "react";
import CollectionBreadcrumb from "../../../CollectionBreadcrumb";
import BasicSearchForm from "./BasicSearchForm";
import { useRouter } from "next/router";
import BasicSearchResult from "./BasicSearchResult";


interface BasicSearchPageProps {}

const BasicSearchPage: FC<BasicSearchPageProps> = ({}) => {
  const router = useRouter();
  const searchKey = useMemo(() => {
    return router.query.textSearch as string;
  }, [router.query.textSearch]);

  return (
    <>
      <div className="flex justify-between p-5">
        <CollectionBreadcrumb />
        <div></div>
      </div>
      <BasicSearchForm className={"py-4 px-6"} />
      {searchKey && searchKey != "" && <BasicSearchResult />}
    </>
  );
};

export default BasicSearchPage;
