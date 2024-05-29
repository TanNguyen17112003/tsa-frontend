import { useRouter } from "next/router";
import { useMemo, type FC, useCallback, useState } from "react";
import CustomSelect from "src/components/CustomSelect/CustomSelect";
import { Button } from "src/components/shadcn/ui/button";
import FormInput from "src/components/ui/FormInput";
import searchTypes from "src/modules/Collection/constants/searchTypes";
import BasicSearchResult from "./BasicSearchResult";

interface BasicSearchFormProps {
    className: string;
}

const BasicSearchForm: FC<BasicSearchFormProps> = ({ className }) => {
    const router = useRouter();
    const currentSearchType = router.query.searchType;
    const [inputValue, setInputValue] = useState<string>("");
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
   const handleSearch = (event: any) => {
        event.preventDefault();
        const newQuery: any = {};
        Object.keys(router.query).forEach((key) =>
            key.startsWith("q") ? null : (newQuery[key] = router.query[key])
        );
        router.replace({
            pathname: router.pathname,
            query: { ...newQuery, keyWords: inputValue },
        });
   }
   const handleInputChange = (value: string) => {
        setInputValue(value)
   }

    const acceptSearchTypes = useMemo(
        () =>
            searchTypes.filter((searchType) =>
                ["basic", "advance", "adjacent"].includes(searchType.value)
            ),
        []
    );
    return (
      <div className={className}>
        <form>
            <div className="flex gap-4">
                <div className="flex items-center border border-gray-300 rounded-md w-full divide-x">
                    <div className="flex w-full items-center">
                        <FormInput
                            type="text"
                            placeholder="Nhập từ khóa tìm kiếm..."
                            className="border-none"
                            onChange={(e) => handleInputChange(e.target.value)}
                        />
                    </div>
                    <CustomSelect
                        options={acceptSearchTypes}
                        value={
                            currentSearchType
                                ? currentSearchType.toString()
                                : ""
                        }
                        onValueChange={handleChange}
                        className="border-none"
                    />
                </div>
                <Button onClick={handleSearch}>Tìm kiếm</Button>
            </div>
        </form>
        <h1 className="font-bold mt-3">Kết quả tìm kiếm</h1>
        <BasicSearchResult />
      </div>
        
    );
};

export default BasicSearchForm;
