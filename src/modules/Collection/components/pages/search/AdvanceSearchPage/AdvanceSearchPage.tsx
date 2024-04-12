import { useMemo, useState, type FC } from "react";
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
  const [curentSearchAdvance, setCurentSearchAdvance] = useState<string[]>([
    "",
  ]);
  const [curentSearchOption, setCurentSearchOption] = useState<string[]>([
    "and",
  ]);

  const updateTextSearch = (index: number, newValue: string) => {
    setCurentSearchAdvance((prevItems) => {
      let updatedItems = [...prevItems];
      updatedItems[index] = newValue;
      if (updatedItems[updatedItems.length - 1] != "")
        updatedItems[updatedItems.length] = "";
      else if (
        updatedItems.length > 1 &&
        updatedItems[updatedItems.length - 1] == "" &&
        updatedItems[updatedItems.length - 2] == ""
      )
        updatedItems = updatedItems.slice(0, updatedItems.length - 1);
      return updatedItems;
    });
  };

  const updateTypeSearch = (index: number, newValue: string) => {
    setCurentSearchOption((prevItems) => {
      let updatedItems = [...prevItems];
      updatedItems[index] = newValue;
      return updatedItems;
    });
  };

  return (
    <>
      <div className="flex justify-between p-5">
        <CollectionBreadcrumb />
        <div></div>
      </div>
      <AdvanceSearchForm
        className={"py-4 px-6"}
        curentSearchAdvance={curentSearchAdvance}
        curentSearchOption={curentSearchOption}
        updateTextSearch={(index, value) => updateTextSearch(index, value)}
        updateTypeSearch={(index, value) => updateTypeSearch(index, value)}
      />
      {textSearch && textSearch != "" && <AdvanceSearchResult />}
    </>
  );
};

export default AdvanceSearchPage;
