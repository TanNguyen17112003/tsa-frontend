import type { FC } from "react";
import { BiSearch } from "react-icons/bi";
import { useCollectionTreeContext } from "./CollectionTree";
import FormInput from "src/components/ui/FormInput";

interface SearchInputProps {}

const SearchInput: FC<SearchInputProps> = ({}) => {
  const { search, setSearch } = useCollectionTreeContext();
  return (
    <div className="flex items-center border border-gray-300 rounded-md mx-4 mb-4 pr-2">
      <div className="flex w-full items-center">
        <FormInput
          type="text"
          placeholder="Tìm kiếm tuyển tập/bộ kinh"
          className="border-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <BiSearch className="h-6 w-6 fill-text-secondary" />
    </div>
  );
};

export default SearchInput;
