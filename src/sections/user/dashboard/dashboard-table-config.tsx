import { HiMiniArrowSmallRight } from "react-icons/hi2";
import { CustomTableConfig } from "src/components/custom-table";
import { Button } from "src/components/shadcn/ui/button";
import { Collection } from "src/types/collections";
const getDashboardTableConfig: CustomTableConfig<
  Collection["id"],
  Collection
>[] = [
  {
    key: "name",
    headerLabel: "Tuyển tập",
    type: "string",
  },
  {
    key: "circa",
    headerLabel: "Niên đại",
    type: "string",
  },
  {
    key: "user_id",
    headerLabel: "Tác giả",
    type: "string",
  },
  {
    key: "link",
    headerLabel: "",
    type: "string",
    renderCell: (data) => (
      <Button variant={"outline"} className="flex">
        Đọc bài <HiMiniArrowSmallRight style={{ fontSize: "1.4em" }} />
      </Button>
    ),
  },
];

export default getDashboardTableConfig;
