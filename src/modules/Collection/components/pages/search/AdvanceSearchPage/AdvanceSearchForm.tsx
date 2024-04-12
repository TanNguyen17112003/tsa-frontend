import { useRouter } from "next/router";
import { useMemo, type FC, useCallback, useState } from "react";
import CustomSelect from "src/components/CustomSelect/CustomSelect";
import { Button } from "src/components/shadcn/ui/button";
import FormInput from "src/components/ui/FormInput";
import searchTypes from "src/modules/Collection/constants/searchTypes";
import AdvanceSearchResult from "./AdvanceSearchResult";

interface AdvanceSearchFormProps {
  className: string;
  updateTextSearch: (index: number, value: string) => void;
  curentSearchAdvance: string[];
  updateTypeSearch: (index: number, value: string) => void;
  curentSearchOption: string[];
}

const AdvanceSearchForm: FC<AdvanceSearchFormProps> = ({
  className,
  updateTextSearch,
  curentSearchAdvance,
  updateTypeSearch,
  curentSearchOption,
}) => {
  const router = useRouter();
  const currentSearchType = router.query.searchType;

  const [textSearch, setTextSearch] = useState<string>("");

  const handleChange = useCallback(
    (value: string) => {
      const newQuery: any = {};
      Object.keys(router.query).forEach((key) =>
        key.startsWith("q") ? null : (newQuery[key] = router.query[key])
      );
      router.replace({
        pathname: router.pathname,
        query: {
          ...newQuery,
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

  const handleSubmit = (event: any) => {
    let temp = textSearch;
    curentSearchAdvance.map((item, index) => {
      if (item && item != "")
        temp = temp + "_" + curentSearchOption[index] + "_" + item;
    });
    router.replace({
      pathname: router.pathname,
      query: {
        ...router.query,
        textSearch: temp,
      },
    });

    event.preventDefault();
  };

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
              onChange={() => {
                const temp: HTMLInputElement = document.getElementById(
                  "textSearch"
                ) as HTMLInputElement;
                setTextSearch(temp.value.trim());
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
          <>
            <div className="flex items-center border border-gray-300 rounded-md w-full divide-x">
              <div className="flex w-full items-center">
                <FormInput
                  type="text"
                  placeholder="Nhập từ khóa"
                  className="border-none"
                  onChange={() => {
                    const temp: HTMLInputElement = document.getElementById(
                      `textSearch${index}`
                    ) as HTMLInputElement;
                    updateTextSearch(index, temp.value);
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
          </>
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
