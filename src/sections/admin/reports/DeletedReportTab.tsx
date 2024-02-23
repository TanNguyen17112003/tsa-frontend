import { HiMagnifyingGlass, HiMiniArrowSmallRight } from "react-icons/hi2";
import { CustomTable } from "src/components/custom-table";
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
import Pagination from "src/components/ui/Pagination";
import { initialReport } from "src/types/report";
import getDeletedReportTableConfig from "./deleted-report-table-config";
import usePagination from "src/hooks/use-pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "src/components/shadcn/ui/dialog";
import { Button } from "src/components/shadcn/ui/button";
import { Label } from "src/components/shadcn/ui/label";

const RowDetail = () => {
  return (
    <Dialog defaultOpen={true}>
      <DialogTrigger asChild>
        <Button variant="outline">Chi tiết khiếu nại</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[50%]">
        <DialogHeader>
          <DialogTitle className="py-4">Chi tiết khiếu nại</DialogTitle>
        </DialogHeader>
        <div className="border rounded-xl p-6 my-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <img src="/logos/logo.png" alt="avt" />
              <div>
                <div className="text-base font-normal">
                  pngiahan3010@gmail.com
                </div>
                <div className="text-xs font-normal text-gray-500">
                  21/12/2023
                </div>
              </div>
            </div>
            <div className="text-xs font-medium text-[#BE123C] bg-[#FFF1F2] border border-[#FECACA] mb-5 px-2 rounded-md">
              Chưa xử lý
            </div>
          </div>
          <div className="p-[20px] space-y-4">
            <div>
              <div className="text-md font-medium">TIÊU ĐỀ KHIẾU NẠI</div>
              <div className="text-sm font-normal">
                Sai thông tin trong bài kinh
              </div>
            </div>
            <div>
              <div className="text-md font-medium">NỘI DUNG CHI TIẾT</div>
              <div className="text-sm font-normal">
                Sai thông tin ở đoạn: “nghĩa là từ chỗ ngồi, và
                nói迦里梨道場,結跏趺坐。 時諸苾芻,頭面禮Chân đứng ở một bên,
                chắp hai tay”
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="flex">
          <Button type="submit" variant={"outline"}>
            Đóng
          </Button>
          <Button type="submit">
            Đến trang xử lý{" "}
            <HiMiniArrowSmallRight
              style={{
                fontSize: "1.4em",
                marginLeft: "5px",
                marginTop: "2px",
              }}
            />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const DeletedReport = () => {
  const report = [
    {
      id: "",
      email: "pngiahan3010",
      content:
        "Sai thông tin ở đoạn: “nghĩa là từ chỗ ngồi, và nói迦里梨道場,結跏趺坐。 時諸苾芻,...",
      title: "Sai thông tin trong bài kinh",
      report_status: "Chưa xử lý",
      created_at: "21/12/2023 10:47:56",
      orison_id: "",
      user_id: "",
      updated_s: "",
    },
    {
      id: "",
      email: "pngiahan3010",
      content:
        "Sai thông tin ở đoạn: “nghĩa là từ chỗ ngồi, và nói迦里梨道場,結跏趺坐。 時諸苾芻,...",
      title: "Sai thông tin trong bài kinh",
      report_status: "Đã xử lý",
      created_at: "21/12/2023 10:47:56",
      orison_id: "",
      user_id: "",
      updated_s: "",
    },
    {
      id: "",
      email: "pngiahan3010",
      content:
        "Sai thông tin ở đoạn: “nghĩa là từ chỗ ngồi, và nói迦里梨道場,結跏趺坐。 時諸苾芻,...",
      title: "Sai thông tin trong bài kinh",
      report_status: "Chưa xử lý",
      created_at: "21/12/2023 10:47:56",
      orison_id: "",
      user_id: "",
      updated_s: "",
    },
    {
      id: "",
      email: "pngiahan3010",
      content:
        "Sai thông tin ở đoạn: “nghĩa là từ chỗ ngồi, và nói迦里梨道場,結跏趺坐。 時諸苾芻,...",
      title: "Sai thông tin trong bài kinh",
      report_status: "Đã xử lý",
      created_at: "21/12/2023 10:47:56",
      orison_id: "",
      user_id: "",
      updated_s: "",
    },
  ];
  const pagination = usePagination({ count: report.length });
  return (
    <div className="flex flex-col divide-y-2">
      <div className="flex-grow pt-8 px-8">
        <div className="flex w-full space-x-4">
          <div
            className="flex items-center border rounded-md w-full"
            onClick={() => console.log("first")}
          >
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
        <div className="pt-8">
          <CustomTable
            rows={report}
            configs={getDeletedReportTableConfig}
            tableClassName="rounded-xl border-2"
            pagination={pagination}
            hidePagination
            onClickRow={RowDetail}
          ></CustomTable>
        </div>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Chi tiết khiếu nại</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[50%]">
          <DialogHeader>
            <DialogTitle className="py-4">Chi tiết khiếu nại</DialogTitle>
          </DialogHeader>
          <div className="border rounded-xl p-6 my-4 bg-[#F9FAFB]">
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <img src="/logos/logo.png" alt="avt" />
                <div>
                  <div className="text-base font-normal">
                    pngiahan3010@gmail.com
                  </div>
                  <div className="text-xs font-normal text-gray-500">
                    21/12/2023
                  </div>
                </div>
              </div>
              <div className="text-xs font-medium text-[#BE123C] bg-[#FFF1F2] border border-[#FECACA] mb-5 px-2 rounded-md">
                Chưa xử lý
              </div>
            </div>
            <div className="p-[20px] space-y-4">
              <div>
                <div className="text-md font-medium">TIÊU ĐỀ KHIẾU NẠI</div>
                <div className="text-sm font-normal">
                  Sai thông tin trong bài kinh
                </div>
              </div>
              <div>
                <div className="text-md font-medium">NỘI DUNG CHI TIẾT</div>
                <div className="text-sm font-normal">
                  Sai thông tin ở đoạn: “nghĩa là từ chỗ ngồi, và
                  nói迦里梨道場,結跏趺坐。 時諸苾芻,頭面禮Chân đứng ở một bên,
                  chắp hai tay”
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="flex">
            <Button type="submit" variant={"outline"}>
              Đóng
            </Button>
            <Button type="submit">
              Đến trang xử lý{" "}
              <HiMiniArrowSmallRight
                style={{
                  fontSize: "1.4em",
                  marginLeft: "5px",
                  marginTop: "2px",
                }}
              />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="fixed flex bottom-0 bg-white justify-between px-7 py-2 w-[calc(100vw-280px)]">
        <div className="flex text-sm text-gray-500 font-normal items-center overflow-hidden text-nowrap">
          Đang hiển thị kết quả thứ 1 tới 10 trên 97 kết quả
        </div>
        <Pagination {...pagination} onChange={pagination.onPageChange} />
      </div>
    </div>
  );
};

export default DeletedReport;
