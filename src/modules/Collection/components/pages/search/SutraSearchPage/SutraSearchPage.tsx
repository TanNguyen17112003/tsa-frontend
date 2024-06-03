import type { FC } from "react";
import CollectionBreadcrumb from "../../../CollectionBreadcrumb";
import SutraSearchForm from "./SutraSearchForm";

interface SutraSearchPageProps {}

const SutraSearchPage: FC<SutraSearchPageProps> = ({}) => {
  return (
    <>
      <div className="flex justify-between p-5">
        <CollectionBreadcrumb />
        <div></div>
      </div>
      <hr />
      <SutraSearchForm className={"py-4 px-6"} />
      
    </>
  );
};

export default SutraSearchPage;
