import { Report } from "src/types/report";
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
import { useCallback } from "react";
import { ReportsApi } from "src/api/reports";
import { useReportsContext } from "src/contexts/reports/reports-context";

const DeleteDialog = ({
  state = false,
  onClose,
  data,
}: {
  state: boolean;
  onClose: () => void;
  data: Report;
}) => {
  const { deleteReport } = useReportsContext();
  const handleDeleteReport = useCallback(
    async (id: Report["id"]) => {
      await deleteReport.call(null, [id]);
      onClose();
    },
    [deleteReport, onClose]
  );
  return (
    <Dialog open={state} onOpenChange={(value) => !value && onClose()}>
      <DialogTrigger asChild>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[40%]">
        <DialogHeader>
          <DialogTitle className="py-4">Xác nhận xóa khiếu nại</DialogTitle>
        </DialogHeader>
        <div>Khiếu nại sẽ bị xóa và nằm trong Danh mục Khiếu nại đã xóa</div>
        <DialogFooter className="flex">
            <Button type="submit" variant={"outline"} onClick={onClose}>
              Hủy bỏ
            </Button>
            <Button type="submit" onClick={() => handleDeleteReport(data.id)}>
              Xác nhận
            </Button> 
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
