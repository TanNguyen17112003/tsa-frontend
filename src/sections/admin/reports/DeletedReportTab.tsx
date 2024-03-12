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
import { useEffect, useMemo, useState } from "react";
import { Report } from "src/types/report";
import { SIDE_NAV_WIDTH } from "src/config";
import ReportDialog from "./ReportDialog";
import useFunction from "src/hooks/use-function";
import { ReportsApi } from "src/api/reports";
import { getFormData } from "src/utils/api-request";
import { useReportsContext } from "src/contexts/reports/reports-context";
import getPaginationText from "src/utils/get-pagination-text";

const DeletedReport = () => {
  const { getReportsApi } = useReportsContext();

  useEffect(() => {
    getReportsApi.call;
  }, [getReportsApi.call]);

  const report = useMemo(() => {
    return getReportsApi.data || [];
  }, [getReportsApi.data]);

  const pagination = usePagination({ count: report.length });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [data, setData] = useState(initialReport);

  return (
    <div className="flex flex-col divide-y-2">
      <div className="flex-grow pt-8 px-8">
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
        <div className="pt-8">
          <CustomTable
            rows={report}
            configs={getDeletedReportTableConfig}
            tableClassName="rounded-xl border-2"
            pagination={pagination}
            hidePagination
            onClickRow={(item, index) => {
              setIsOpen(true);
              setData(item);
            }}
          ></CustomTable>
        </div>
      </div>

      <ReportDialog
        state={isOpen}
        onClose={() => setIsOpen(false)}
        data={data}
      />

      {getPaginationText(pagination)}
    </div>
  );
};

export default DeletedReport;
