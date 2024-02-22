import { HiMagnifyingGlass } from "react-icons/hi2";
import { CustomTable } from "src/components/custom-table";
import { Button } from "src/components/shadcn/ui/button";
import { Input } from "src/components/shadcn/ui/input";
import { initialCirca } from "src/types/circas";
import getCircasTableConfig from "./nien-dai-table-config";
import { useMemo } from "react";
import CircaEditSheet from "./CircaEditSheet";

const circa = [initialCirca];

const Chronology = () => {
  const accountCircasConfig = useMemo(() => {
    return getCircasTableConfig({
      onClickDelete: (data) => {},
    });
  }, []);
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
          <CircaEditSheet />
        </div>
      </div>
      <CustomTable rows={circa} configs={accountCircasConfig}></CustomTable>
    </div>
  );
};

export default Chronology;
