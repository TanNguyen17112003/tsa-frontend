import { FaArrowRight } from "react-icons/fa6";
import { CustomTableConfig } from "src/components/custom-table";
import { Button } from "src/components/shadcn/ui/button";
import { Report, ReportDetail } from "src/types/report";

const reportTableConfig = ({
  setIsOpen,
  setData,
}: {
  setIsOpen: (value: boolean) => void;
  setData: (value: ReportDetail) => void;
}): CustomTableConfig<Report["id"], Report>[] => [
  {
    key: "email",
    headerLabel: "Email",
    type: "string",
  },
  {
    key: "created_at",
    headerLabel: "Thời gian khiếu nại",
    type: "date",
  },
  {
    key: "content",
    headerLabel: "Tiêu đề",
    type: "string",
    renderCell: (data) => (
      <div>
        <div>{data.title}</div>
      </div>
    ),
  },
  {
    key: "detail",
    headerLabel: "",
    type: "string",
    renderCell: (data) => (
      <div>
        <Button variant={"outline"} className="space-x-2">
          <div
            onClick={() => {
              setIsOpen(true);
              setData(data);
            }}
          >
            Chi tiết
          </div>
          <FaArrowRight />
        </Button>
      </div>
    ),
  },
];

export default reportTableConfig;
