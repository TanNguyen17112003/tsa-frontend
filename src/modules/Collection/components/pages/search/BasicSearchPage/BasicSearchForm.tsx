import { useRouter } from "next/router";
import { useMemo, type FC, useCallback, useEffect, useState } from "react";
import CustomSelect from "src/components/CustomSelect/CustomSelect";
import { Button } from "src/components/shadcn/ui/button";
import FormInput from "src/components/ui/FormInput";
import searchTypes from "src/modules/Collection/constants/searchTypes";
import useAppSnackbar from "src/hooks/use-app-snackbar";
import { paths } from "src/paths";

interface BasicSearchFormProps {
    className: string;
}

const BasicSearchForm: FC<BasicSearchFormProps> = ({ className }) => {
  const router = useRouter();
  const currentSearchType = router.query.searchType;

  const { showSnackbarError } = useAppSnackbar();

  const handleChange = useCallback(
    (value: string) => {
      const newQuery: any = {};
      Object.keys(router.query).forEach((key) =>
        key.startsWith("q") ? null : (newQuery[key] = router.query[key])
      );
      router.replace({
        pathname: router.pathname,
        query: { searchType: value },
      });
    },
    [router]
  );

  const handleClickSearch = useCallback(
    (value: string) => {
      const searchType = router.query.searchType;
      router.replace({
        pathname: router.pathname.includes("collections") ? router.pathname : paths.dashboard.collections,
        query: { ...router.query, textSearch: value, searchType: searchType ?  searchType : "basic" },
      });
    },
    [router]
  );

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const searchInput: HTMLInputElement = document.getElementById(
      "search"
    ) as HTMLInputElement;
    const wordLength = searchInput.value.replace(/\s+/g, " ").split(" ").length;
    if (wordLength > 15) {
      showSnackbarError("Không thể tìm kiếm quá 15 từ!");
      return;
    }
    const searchValue = searchInput?.value;
    router.replace({
      pathname: router.pathname,
      query: { ...router.query, textSearch: searchValue },
    });
  };

  const acceptSearchTypes = useMemo(
    () =>
      searchTypes.filter((searchType) =>
        ["basic", "advance", "adjacent"].includes(searchType.value)
      ),
    []
  );

  return (
    <div>
      <form className={className} onSubmit={handleSubmit}>
        <div className="flex gap-4">
          <div className="flex items-center border border-gray-300 rounded-md w-full divide-x">
            <div className="flex w-full items-center">
              <FormInput
                type="text"
                placeholder="Nhập từ khóa tìm kiếm..."
                className="border-none"
                id="search"
              />
            </div>
            <CustomSelect
              options={acceptSearchTypes}
              value={currentSearchType ? currentSearchType.toString() : ""}
              onValueChange={handleChange}
              className="border-none"
            />
          </div>
          <Button type="submit"> Tìm kiếm</Button>
        </div>
      </form>
    </div>
  );
};

export default BasicSearchForm;
