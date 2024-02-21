import { HiMagnifyingGlass } from "react-icons/hi2";
import { CustomTable } from "src/components/custom-table";
import { Input } from "src/components/shadcn/ui/input";
import { initialFormat } from "src/types/formats";
import getFormatTableConfig from "./dinh-dang-trang-table-config";

const PageFormat = () => {
  const format = [initialFormat];
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
      </div>
      <CustomTable rows={format} configs={getFormatTableConfig}></CustomTable>
    </div>
  );
};

export default PageFormat;
