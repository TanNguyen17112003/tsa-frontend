import { HiMagnifyingGlass } from "react-icons/hi2";
import { Input } from "src/components/shadcn/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "src/components/shadcn/ui/select";

const ComplaintManagement = () => {
  return (
    <>
      <div className="flex w-full space-x-4">
        <div className="flex items-center border rounded-md w-full">
          <Input placeholder="Tìm kiếm" className="border-none" />
          <HiMagnifyingGlass
            style={{ fontSize: "1.5rem", marginRight: "10px" }}
          />
        </div>
        <div className="border rounded-md">
          <div className="text-xs font-semibold text-nowrap pl-3 pt-2">
            Tình trạng
          </div>
          <Select>
            <SelectTrigger className="w-[200px] border-none">
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="1">Chưa xử lý</SelectItem>
                <SelectItem value="2">Đã xử lý</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="py-8">Table Complaint</div>
    </>
  );
};

export default ComplaintManagement;
