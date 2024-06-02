import { CustomTableConfig } from "src/components/custom-table";
import { Report } from "src/types/report";
import { BsArrowRepeat } from "react-icons/bs";
import StatusCard from "src/components/StatusCard/StatusCard";
import { Button } from "src/components/shadcn/ui/button";
import { HiMiniArrowSmallRight } from "react-icons/hi2";

const getDeletedReportTableConfig: CustomTableConfig<Report["id"], Report>[] = [
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
            <StatusCard
                status={
                    data.report_status === "pending" ? "Chưa xử lý" : "Đã xử lý"
                }
            />
        ),
    },
    {
        key: "updated_at",
        headerLabel: "Cập nhật gần đây",
        type: "date",
    },
];

export default getDeletedReportTableConfig;
