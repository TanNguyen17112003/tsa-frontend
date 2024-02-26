import type { FC } from "react";
import CollectionBreadcrumb from "../../../CollectionBreadcrumb";
import FormInput from "src/components/ui/FormInput";
import CustomSelect from "src/components/CustomSelect/CustomSelect";
import { Button } from "src/components/shadcn/ui/button";
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
