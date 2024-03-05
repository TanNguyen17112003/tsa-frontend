import type { FC } from "react";
import CollectionBreadcrumb from "../../../CollectionBreadcrumb";
import CircaSearchForm from "./CircaSearchForm";

interface CircaSearchPageProps {}

const CircaSearchPage: FC<CircaSearchPageProps> = ({}) => {
  return (
    <>
      <div className="flex justify-between p-5">
        <CollectionBreadcrumb />
        <div></div>
      </div>
      <hr />
      <div className="p-6">
        <div className="max-w-[928px] mx-auto">
          <CircaSearchForm />
        </div>
      </div>
    </>
  );
};

export default CircaSearchPage;
