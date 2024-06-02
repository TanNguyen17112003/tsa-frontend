import { useRouter } from "next/router";
import { useMemo, type FC, useCallback, useState } from "react";
import CustomSelect from "src/components/CustomSelect/CustomSelect";
import { Button } from "src/components/shadcn/ui/button";
import FormInput from "src/components/ui/FormInput";
import searchTypes from "src/modules/Collection/constants/searchTypes";
import AdvanceSearchResult from "./AdvanceSearchResult";
import { paths } from "src/paths";

interface AdvanceSearchFormProps {
  className: string;
}
const advanceSearchType = [
  {
    label: "And",
    value: "and",
  },
  {
    label: "Or",
    value: "or",
  },
  {
    label: "Not",
    value: "not",
  },
];

const AdvanceSearchForm: FC<AdvanceSearchFormProps> = ({ className }) => {
  const router = useRouter();
  const currentSearchType = router.query.searchType;

  const [textSearch, setTextSearch] = useState<string>("");

  const [curentSearchAdvance, setCurentSearchAdvance] = useState<string[]>([
    "",
  ]);
  const [curentSearchOption, setCurentSearchOption] = useState<string[]>([
    "and",
  ]);

  const handleChange = useCallback(
    (value: string) => {
      const newQuery: any = {};
      Object.keys(router.query).forEach((key) =>
        key.startsWith("q") ? null : (newQuery[key] = router.query[key])
      );
      router.replace({
        pathname: router.pathname,
        query: {
          searchType: value,
        },
      });
    },
    [router]
  );

  const acceptSearchTypes = useMemo(
    () =>
      searchTypes.filter((searchType) =>
        ["basic", "advance", "adjacent"].includes(searchType.value)
      ),
    []
  );

  const handleSubmit = useCallback(
    (event: any) => {
      router.replace({  
        pathname: router.pathname.includes("collections") ? router.pathname : paths.dashboard.collections,
        query: {
          ...router.query,
          textSearch: [textSearch, ...curentSearchAdvance].filter(
            (text) => text
          ),
          optionSearch: curentSearchOption,
        },
      });

      event.preventDefault();
    },
    [curentSearchAdvance, curentSearchOption, router, textSearch]
  );

  const updateTextSearch = useCallback((index: number, newValue: string) => {
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
  }, []);

  const updateTypeSearch = useCallback((index: number, newValue: string) => {
    setCurentSearchOption((prevItems) => {
      let updatedItems = [...prevItems];
      updatedItems[index] = newValue;
      return updatedItems;
    });
  }, []);

  return (
    <form className={className} onSubmit={handleSubmit}>
      <div className="gap-4 space-y-4">
        <div className="flex items-center border border-gray-300 rounded-md w-full divide-x">
          <div className="flex w-full items-center">
            <FormInput
              type="text"
              placeholder="Nhập từ khóa"
              className="border-none"
              id="textSearch"
              onChange={(e) => {
                setTextSearch(e.target.value);
              }}
            />
          </div>
          <CustomSelect
            options={acceptSearchTypes}
            value={currentSearchType ? currentSearchType.toString() : ""}
            onValueChange={handleChange}
            className="border-none"
          />
        </div>
        {curentSearchAdvance.map((item, index) => (
          <div
            className="flex items-center border border-gray-300 rounded-md w-full divide-x"
            key={index}
          >
            <div className="flex w-full items-center">
              <FormInput
                type="text"
                placeholder="Nhập từ khóa"
                className="border-none"
                onChange={(e) => {
                  updateTextSearch(index, e.target.value);
                  updateTypeSearch(index, curentSearchOption[index] || "and");
                }}
                id={`textSearch${index}`}
              />
            </div>
            <CustomSelect
              options={advanceSearchType}
              value={
                curentSearchOption[index]
                  ? curentSearchOption[index].toString()
                  : "and"
              }
              onValueChange={(value) => {
                updateTypeSearch(index, value);
              }}
              className="border-none"
            />
          </div>
        ))}
        <Button className="flex ml-auto" type="submit">
          {" "}
          Tìm kiếm
        </Button>
      </div>
    </form>
  );
};

export default AdvanceSearchForm;
