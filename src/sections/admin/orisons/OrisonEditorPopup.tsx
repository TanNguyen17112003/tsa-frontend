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
  const countWord = (text: string) => {
    const vietnameseCharacters = [
      "a",
      "ă",
      "â",
      "b",
      "c",
      "d",
      "đ",
      "e",
      "ê",
      "g",
      "h",
      "i",
      "k",
      "l",
      "m",
      "n",
      "o",
      "ô",
      "ơ",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "ư",
      "v",
      "x",
      "y",
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
    ];

    const lowerCaseStr = text.toLowerCase();

    let count = 0;
    for (let i = 0; i < lowerCaseStr.length; i++) {
      if (vietnameseCharacters.includes(lowerCaseStr[i])) {
        count++;
      }
    }
    return count;
  };
  const { showSnackbarSuccess } = useAppSnackbar();

  return (
    <Dialog open={state} onOpenChange={(value) => !value && onClose()}>
      <DialogTrigger asChild>
        {/* <Button variant="outline">Chi tiết khiếu nại</Button> */}
      </DialogTrigger>
      {titleDialog == "Đếm số từ" ? (
        <DialogContent className="sm:max-w-[20%]">
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
        <DialogContent className="sm:max-w-[30%]">
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
