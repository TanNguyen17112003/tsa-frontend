import { HiMagnifyingGlass } from "react-icons/hi2";
import { CustomTable } from "src/components/custom-table";
import { Button } from "src/components/shadcn/ui/button";
import { Input } from "src/components/shadcn/ui/input";
import { initialFormat } from "src/types/formats";
import getSortWordTableConfig from "./tu-viet-tat-table-config";
import SortWordEditSheet from "./SortWordEditSheet";

const Abbreviation = () => {
  const word = [initialFormat];
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
        <div className="flex ml-auto items-center">
          <SortWordEditSheet />
        </div>
      </div>
      <CustomTable rows={word} configs={getSortWordTableConfig}></CustomTable>
    </div>
  );
};

export default Abbreviation;
