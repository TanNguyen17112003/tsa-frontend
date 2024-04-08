import { useRouter } from "next/router";
import { useMemo, type FC, useCallback, useState } from "react";
import CustomSelect from "src/components/CustomSelect/CustomSelect";
import { Button } from "src/components/shadcn/ui/button";
import FormInput from "src/components/ui/FormInput";
import searchTypes from "src/modules/Collection/constants/searchTypes";

interface AdvanceSearchFormProps {
  className: string;
}

const AdvanceSearchForm: FC<AdvanceSearchFormProps> = ({ className }) => {
  const router = useRouter();
  const currentSearchType = router.query.searchType;
  const [curentSearchAdvance1, setCurentSearchAdvance1] = useState("And");
  const [curentSearchAdvance2, setCurentSearchAdvance2] = useState("And");
  const [curentSearchAdvance3, setCurentSearchAdvance3] = useState("And");

  const handleChange = useCallback(
    (value: string) => {
      const newQuery: any = {};
      Object.keys(router.query).forEach((key) =>
        key.startsWith("q") ? null : (newQuery[key] = router.query[key])
      );
      router.replace({
        pathname: router.pathname,
        query: { ...newQuery, searchType: value },
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
      value: "And",
    },
    {
      label: "Or",
      value: "Or",
    },
    {
      label: "Not",
      value: "Not",
    },
  ];

  return (
    <form className={className}>
      <div className="gap-4 space-y-4">
        <div className="flex items-center border border-gray-300 rounded-md w-full divide-x">
          <div className="flex w-full items-center">
            <FormInput
              type="text"
              placeholder="Nhập từ khóa"
              className="border-none"
            />
          </div>
          <CustomSelect
            options={acceptSearchTypes}
            value={currentSearchType ? currentSearchType.toString() : ""}
            onValueChange={handleChange}
            className="border-none"
          />
        </div>
        <div className="flex items-center border border-gray-300 rounded-md w-full divide-x">
          <div className="flex w-full items-center">
            <FormInput
              type="text"
              placeholder="Nhập từ khóa"
              className="border-none"
            />
          </div>
          <CustomSelect
            options={advanceSearchType}
            value={curentSearchAdvance1 ? curentSearchAdvance1.toString() : ""}
            onValueChange={(value) => setCurentSearchAdvance1(value)}
            className="border-none"
          />
        </div>
        <div className="flex items-center border border-gray-300 rounded-md w-full divide-x">
          <div className="flex w-full items-center">
            <FormInput
              type="text"
              placeholder="Nhập từ khóa"
              className="border-none"
            />
          </div>
          <CustomSelect
            options={advanceSearchType}
            value={curentSearchAdvance2 ? curentSearchAdvance2.toString() : ""}
            onValueChange={(value) => setCurentSearchAdvance2(value)}
            className="border-none"
          />
        </div>
        <div className="flex items-center border border-gray-300 rounded-md w-full divide-x">
          <div className="flex w-full items-center">
            <FormInput
              type="text"
              placeholder="Nhập từ khóa"
              className="border-none"
            />
          </div>
          <CustomSelect
            options={advanceSearchType}
            value={curentSearchAdvance3 ? curentSearchAdvance3.toString() : ""}
            onValueChange={(value) => setCurentSearchAdvance3(value)}
            className="border-none"
          />
        </div>
        <Button className="flex ml-auto"> Tìm kiếm</Button>
      </div>
    </form>
  );
};

export default AdvanceSearchForm;
