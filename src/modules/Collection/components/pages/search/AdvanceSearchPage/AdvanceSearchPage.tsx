import type { FC } from "react";
import CollectionBreadcrumb from "../../../CollectionBreadcrumb";
import AdvanceSearchForm from "./AdvanceSearchForm";

interface AdvanceSearchPageProps {}

const AdvanceSearchPage: FC<AdvanceSearchPageProps> = ({}) => {
  return (
    <>
      <div className="flex justify-between p-5">
        <CollectionBreadcrumb />
        <div></div>
      </div>
      <AdvanceSearchForm className={"py-4 px-6"} />
    </>
  );
};

export default AdvanceSearchPage;
