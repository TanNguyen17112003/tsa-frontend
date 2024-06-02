import { CustomTableConfig } from "src/components/custom-table";
import { Report } from "src/types/report";
import StatusCard from "src/components/StatusCard/StatusCard";
import { Button } from "src/components/shadcn/ui/button";
import { HiMiniArrowSmallRight } from "react-icons/hi2";


const getReportManagementTableConfig: CustomTableConfig<
  Report["id"],
  Report
>[] = [
  {
    key: "email",
    headerLabel: "Người khiếu nại",
    type: "string",
  },
  {
    key: "content",
    headerLabel: "Nội dung khiếu nại",
    type: "string",
    renderCell: (data) => (
      <div>
        <div>{data.title}</div>
        <div>{data.content}</div>
      </div>
    ),
  },
  {
    key: "created_at",
    headerLabel: "Thời gian khiếu nại",
    type: "date",
  },
  {
    key: "report_status",
    headerLabel: "Trạng thái",
    type: "string",
    renderCell: (data) => (
      <StatusCard status={data.report_status === "pending" ? "Chưa xử lý" : "Đã xử lý"}/>
    )
  },
  {
    key: "updated_at",
    headerLabel: "Cập nhật gần đây",
    type: "date",
    renderCell: (data) => {
      const date = new Date(data.updated_at);
      const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  
      return data.report_status === "pending" ? (
        <Button 
          type="submit" 
          className="bg-transparent hover:bg-orange-200 text-orange-400"
        >
          Xử lý khiếu nại{" "}
          <HiMiniArrowSmallRight
            style={{
              fontSize: "1.4em"
            }}
          />
        </Button>
      ) : (
        <div>
          {formattedDate}
        </div>
      );
    }
  }
];

export default getReportManagementTableConfig;
