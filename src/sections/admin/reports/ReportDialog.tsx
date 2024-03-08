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

const ReportDialog = ({
  state = false,
  onClose,
  data,
}: {
  state: boolean;
  onClose: () => void;
  data: Report;
}) => {
  const dateObject = new Date(data.created_at);
  var day =
    dateObject.getDate() < 10
      ? "0" + dateObject.getDate()
      : dateObject.getDate();
  var month =
    dateObject.getMonth() + 1 < 10
      ? "0" + (dateObject.getMonth() + 1)
      : dateObject.getMonth() + 1;
  var year = dateObject.getFullYear();
  return (
    <Dialog open={state} onOpenChange={(value) => !value && onClose()}>
      <DialogTrigger asChild>
        {/* <Button variant="outline">Chi tiết khiếu nại</Button> */}
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
                  {day + "/" + month + "/" + year}
                </div>
              </div>
            </div>
            {data.report_status == "Chưa xử lý" ? (
              <div className="text-xs font-medium text-rose-700 border bg-rose-50 border-rose-200 mb-5 px-2 rounded-md">
                {data.report_status}
              </div>
            ) : (
              <div className="text-xs font-medium text-green-600 bg-green-50 border border-green-200 mb-5 px-2 rounded-md">
                {data.report_status}
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
          <Button type="submit" variant={"outline"} onClick={onClose}>
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

export default ReportDialog;
