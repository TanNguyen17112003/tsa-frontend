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
import { useCallback } from "react";
import { useReportsContext } from "src/contexts/reports/reports-context";

const RevertDialog = ({
  state = false,
  onClose,
  data,
}: {
  state: boolean;
  onClose: () => void;
  data: Report;
}) => {
    const { updateReport } = useReportsContext();
    const handleRevertReport = useCallback(
        async (data: Report) => {
            await updateReport.call(data.id, {
                id: data.id, 
                email: data.email,
                content: data.content,
                title: data.title,
                report_status: "pending",
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
      <DialogContent className="sm:max-w-[40%]">
        <DialogHeader>
          <DialogTitle className="py-4">Xác nhận hoàn tác khiếu nại</DialogTitle>
        </DialogHeader>
        <div>Khiếu nại sau khi hoàn tác sẽ trở về danh mục Quản lý khiếu nại</div>
        <DialogFooter className="flex">
            <Button type="submit" variant={"outline"} onClick={onClose}>
              Hủy bỏ
            </Button>
            <Button type="submit" onClick={() => handleRevertReport(data)}>
              Xác nhận
            </Button> 
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RevertDialog;
