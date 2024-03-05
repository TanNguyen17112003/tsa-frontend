import type { FC } from "react";
import CollectionBreadcrumb from "../../../CollectionBreadcrumb";
import BasicSearchForm from "./BasicSearchForm";

interface BasicSearchPageProps {}

const BasicSearchPage: FC<BasicSearchPageProps> = ({}) => {
  return (
    <>
      <div className="flex justify-between p-5">
        <CollectionBreadcrumb />
        <div></div>
      </div>
      <BasicSearchForm className={"py-4 px-6"} />
    </>
  );
};

export default BasicSearchPage;
