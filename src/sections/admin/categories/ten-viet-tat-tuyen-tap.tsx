import { HiMagnifyingGlass } from "react-icons/hi2";
import { CustomTable } from "src/components/custom-table";
import { Button } from "src/components/shadcn/ui/button";
import { Input } from "src/components/shadcn/ui/input";
import { initialFormat } from "src/types/formats";
import getSortNameTableConfig from "./ten-viet-tat-tuyen-tap-table-config";
import SortNameEditSheet from "./SortNameEditSheet";

const CollectionAbbreviation = () => {
  const name = [initialFormat];
  return (
    <div className="flex-col">
      <div className="flex py-[32px] space-x-3">
        <div className="flex p-2  border border-gray-300 rounded-md h-12 w-full">
          <div className="flex w-full items-center">
            <Input
              type="text"
              placeholder="Tìm kiếm"
              className="border-none outline-none w-full text-sm/normal"
            />
            <HiMagnifyingGlass style={{ fontSize: "1.5rem", color: "gray" }} />
          </div>
        </div>
        <div className="ml-auto flex">
          <div className="flex items-center">
            <SortNameEditSheet />
          </div>
        </div>
      </div>
      <CustomTable rows={name} configs={getSortNameTableConfig}></CustomTable>
    </div>
  );
};

export default CollectionAbbreviation;
