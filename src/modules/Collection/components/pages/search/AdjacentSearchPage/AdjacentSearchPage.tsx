import type { FC } from "react";
import CollectionBreadcrumb from "../../../CollectionBreadcrumb";
import AdjacentSearchForm from "./AdjacentSearchForm";

interface AdjacentSearchPageProps {}

const AdjacentSearchPage: FC<AdjacentSearchPageProps> = ({}) => {
  return (
    <>
      <div className="flex justify-between p-5">
        <CollectionBreadcrumb />
        <div></div>
      </div>
      <AdjacentSearchForm className={"py-4 px-6"} />
    </>
  );
};

export default AdjacentSearchPage;
