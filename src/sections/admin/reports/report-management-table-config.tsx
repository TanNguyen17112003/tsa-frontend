import { CustomTableConfig } from "src/components/custom-table";
import { Report } from "src/types/report";

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
    key: "create_at",
    headerLabel: "Thời gian khiếu nại",
    type: "string",
  },
  {
    key: "report_status",
    headerLabel: "Trạng thái",
    type: "string",
  },
  {
    key: "updated_s",
    headerLabel: "Cập nhật gần đây",
    type: "number",
  },
];

export default getReportManagementTableConfig;
