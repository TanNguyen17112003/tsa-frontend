import { Report } from "src/types/report";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "src/components/shadcn/ui/dialog";
import { Button } from "src/components/shadcn/ui/button";
import { HiMiniArrowSmallRight } from "react-icons/hi2";
import { CheckCircleIcon } from "lucide-react";
import { format } from "date-fns";
import { useReportsContext } from "src/contexts/reports/reports-context";
import { useCallback } from "react";
import { useRouter } from "next/router";
import { ReportDetail } from "src/types/report";
import ButtonNavigate from "src/modules/Collection/components/ButtonNavigte/ButtonNavigate";
const ReportDialog = ({
  state = false,
  onClose,
  data,
}: {
  state: boolean;
  onClose: () => void;
  data: Report;
}) => {
  const { updateReport } = useReportsContext();
  const router = useRouter();
  const handleProcessStatus = useCallback(
    async (data: Report) => {
      await updateReport.call(data.id, {
        id: data.id, 
        email: data.email,
        content: data.content,
        title: data.title,
        report_status: "processed",
        selection: data.selection,
        selection_content: data.selection_content,
        orison_id: data.orison_id || "27b2aad3-d108-4a65-8e14-3a7f6608290d",
        user_id: data.user_id,
        created_at: data.created_at,
        updated_at: data.updated_at,
      });
      onClose();
    },
    [updateReport, onClose]
  );

  return (
    <Dialog open={state} onOpenChange={(value) => !value && onClose()}>
      <DialogTrigger asChild>
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
                <div className="text-base font-normal">{data.email}</div>
                <div className="text-xs font-normal text-gray-500">
                  {data.created_at
                    ? format(new Date(data.created_at), "dd/MM/yyyy")
                    : "-"}
                </div>
              </div>
            </div>
            {data.report_status == "pending" ? (
              <div className="text-xs font-medium text-rose-700 border bg-rose-50 border-rose-200 mb-5 px-2 rounded-md">
                Chưa xử lý
              </div>
            ) : (
              <div className="text-xs font-medium text-green-600 bg-green-50 border border-green-200 mb-5 px-2 rounded-md">
                Đã xử lý
              </div>
            )}
          </div>
          <div className="p-[20px] space-y-4">
            <div>
              <div className="text-md font-medium">TIÊU ĐỀ KHIẾU NẠI</div>
              <div className="text-sm font-normal">{data.title}</div>
            </div>
            <div>
              <div className="text-md font-medium">NỘI DUNG CHI TIẾT</div>
              <div className="text-sm font-normal">{data.content}</div>
            </div>
          </div>
        </div>
        <DialogFooter className="flex">
          {data.report_status === "pending" ? (
            <>
              <Button type="submit" className="bg-cyan-500 hover:bg-cyan-700" onClick={() => handleProcessStatus(data)}>
              <CheckCircleIcon
                  style={{
                    fontSize: "1em",
                    marginRight: "10px",
                    marginTop: "2px",
                  }}
                />
                Đánh dấu đã xử lý{" "}
              </Button>
              <ButtonNavigate data={data} isHidden={false} />
              <Button type="submit" variant={"outline"} onClick={onClose}>
                Đóng
              </Button>
            </>
          ) : ( <>
            <Button type="submit" variant={"outline"} onClick={onClose}>
              Đóng
            </Button>
            <ButtonNavigate data={data} isHidden={false} />
          </>)}  
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog;
