import type { FC } from "react";
import CollectionBreadcrumb from "../../../CollectionBreadcrumb";
import TextSearchForm from "./TextSearchForm";

interface TextSearchPageProps {}

const TextSearchPage: FC<TextSearchPageProps> = ({}) => {
  return (
    <>
      <div className="flex justify-between p-5">
        <CollectionBreadcrumb />
        <div></div>
      </div>
      <TextSearchForm className={"py-4 px-6"} />
    </>
  );
};

export default TextSearchPage;
