import { HiMiniArrowSmallRight } from "react-icons/hi2";
import { CustomTableConfig } from "src/components/custom-table";
import { Button } from "src/components/shadcn/ui/button";
import { Sutra, SutraDetail } from "src/types/sutra";
const getDashboardSutraTableConfigs = ({
  onClickDetail,
}: {
  onClickDetail: (sutra: SutraDetail) => void;
}): CustomTableConfig<Sutra["id"], SutraDetail>[] => [
  {
    key: "name",
    headerLabel: "Tuyển tập",
    type: "string",
  },
  {
    key: "circa",
    headerLabel: "Niên đại",
    type: "string",
    renderCell: (params) =>
      `${params.circa.start_year} - ${params.circa.end_year}`,
  },
  {
    key: "author.author",
    headerLabel: "Tác giả",
    type: "string",
  },
  {
    key: "link",
    headerLabel: "",
    type: "string",
    renderCell: (data) => (
      <Button
        variant={"outline"}
        className="flex"
        onClick={() => onClickDetail(data)}
      >
        Đọc bài <HiMiniArrowSmallRight style={{ fontSize: "1.4em" }} />
      </Button>
    ),
  },
];

export default getDashboardSutraTableConfigs;
