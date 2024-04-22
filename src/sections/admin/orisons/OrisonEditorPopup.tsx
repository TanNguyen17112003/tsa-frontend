import { useCallback } from "react";
import { Button } from "src/components/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "src/components/shadcn/ui/dialog";
import useAppSnackbar from "src/hooks/use-app-snackbar";

const OrisonEditorPopup = ({
  state = false,
  onClose,
  data,
  titleDialog,
  contentDialog,
}: {
  state: boolean;
  onClose: () => void;
  data: string;
  titleDialog: string;
  contentDialog: string;
}) => {
  const countWord = useCallback((text: string) => {
    const textFilter = text
      .toLowerCase()
      .split(/[ .]+/)
      .filter((item) => item != "");
    return textFilter.length;
  }, []);
  const { showSnackbarSuccess } = useAppSnackbar();

  return (
    <Dialog open={state} onOpenChange={(value) => !value && onClose()}>
      <DialogTrigger asChild>
        {/* <Button variant="outline">Chi tiết khiếu nại</Button> */}
      </DialogTrigger>
      {titleDialog == "Đếm số từ" ? (
        <DialogContent className="sm:max-w-[20%] sm:min-w-[500px]">
          <DialogHeader>
            <DialogTitle className="py-4">{titleDialog}</DialogTitle>
          </DialogHeader>
          <div className="text-sm font-normal text-gray-500 flex space-x-1">
            <div>{contentDialog}</div>
            <div className=" text-cyan-500">{countWord(data)}</div>
          </div>
          <DialogFooter className="flex">
            <Button type="submit" variant={"default"} onClick={onClose}>
              Xác nhân
            </Button>
          </DialogFooter>
        </DialogContent>
      ) : (
        <DialogContent className="sm:max-w-[30%] sm:min-w-[600px]">
          <DialogHeader>
            <DialogTitle className="py-4">{titleDialog}</DialogTitle>
          </DialogHeader>
          <div className="text-sm font-normal text-gray-500 flex space-x-1">
            {data + ": " + contentDialog}
          </div>
          <DialogFooter className="flex">
            <Button
              type="submit"
              variant={"outline"}
              onClick={() => {
                navigator.clipboard.writeText(contentDialog);
                showSnackbarSuccess("Copy Trích dẫn nguồn thành công!");
              }}
            >
              Sao chép
            </Button>
            <Button type="submit" variant={"default"} onClick={onClose}>
              Xác nhân
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default OrisonEditorPopup;
