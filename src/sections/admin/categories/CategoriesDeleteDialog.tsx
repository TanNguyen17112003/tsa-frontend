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
import { HiMiniArrowSmallRight } from "react-icons/hi2";
import { format } from "date-fns";
import useFunction from "src/hooks/use-function";
import { useCallback } from "react";
import { useAuthorsContext } from "src/contexts/authors/authors-context";
import { useFormatSutrasContext } from "src/contexts/format-sutras/format-sutras-context";
import { useFormatPagesContext } from "src/contexts/format-pages/format-pages-context";
import { useCircasContext } from "src/contexts/circas/circas-context";
import { RiErrorWarningLine } from "react-icons/ri";

const CategoriesDeleteDialog = ({
  state = false,
  onClose,
  data,
  id,
}: {
  state: boolean;
  onClose: () => void;
  data: string;
  id: string;
}) => {
  const { deleteAuthor } = useAuthorsContext();
  const { deleteFormatSutra } = useFormatSutrasContext();
  const { deleteFormatPage } = useFormatPagesContext();
  const { deleteCirca } = useCircasContext();

  const handleDelete = useCallback(
    async (values: any) => {
      if (id) {
        if (data == "tác giả") await deleteAuthor([id]);
        else if (data == "tên viết tắt") await deleteFormatSutra([id]);
        else if (data == "từ viết tắt") await deleteFormatPage([id]);
        else if (data == "niên đại") await deleteCirca([id]);
      }
      onClose();
    },
    [
      deleteAuthor,
      deleteFormatSutra,
      deleteFormatPage,
      deleteCirca,
      id,
      onClose,
      data,
    ]
  );

  const handleDeleteHelper = useFunction(handleDelete, {
    successMessage: `Xóa ${data} thành công!`,
  });
  return (
    <Dialog open={state} onOpenChange={(value) => !value && onClose()}>
      <DialogTrigger asChild>
        {/* <Button variant="outline">Chi tiết khiếu nại</Button> */}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex pt-4">
            <RiErrorWarningLine
              style={{
                padding: "8px",
                fontSize: "2.5rem",
                backgroundColor: "mistyrose",
                borderRadius: "25px",
                color: "red",
              }}
            />
            <div className="pl-4 pt-1.5">Xóa {data}</div>
          </DialogTitle>
          <div className="pl-14">Xác nhận xóa {data} này</div>
        </DialogHeader>
        <DialogFooter className="flex">
          <Button type="submit" variant={"outline"} onClick={onClose}>
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            variant={"destructive"}
            onClick={handleDeleteHelper.call}
          >
            Xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CategoriesDeleteDialog;
