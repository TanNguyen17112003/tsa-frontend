import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { CustomTableConfig } from "src/components/custom-table";
import { Button } from "src/components/shadcn/ui/button";
import { FormatSutra } from "src/types/format-sutra";

const getAcronymsNameTableConfig = ({
  onClickDelete,
  onClickEdit,
}: {
  onClickDelete: (data: FormatSutra) => void;
  onClickEdit: (data: FormatSutra) => void;
}): CustomTableConfig<FormatSutra["id"], FormatSutra>[] => [
  {
    key: "short",
    headerLabel: "Tên viết tắt tuyển tập",
    type: "string",
  },
  {
    key: "full",
    headerLabel: "Tên đầy đủ tuyển tập",
    type: "string",
  },
  {
    key: "delete",
    headerLabel: "Xóa",
    type: "string",
    renderCell: (data) => (
      <div className="flex">
        <Button className="text-cyan-600" variant="link">
          <FaRegEdit
            onClick={() => onClickEdit(data)}
            style={{
              fontSize: "1.1rem",
            }}
          />
        </Button>
        <Button className="text-red-600" variant="link">
          <RiDeleteBin6Line
            onClick={() => onClickDelete(data)}
            style={{
              fontSize: "1.1rem",
            }}
          />
        </Button>
      </div>
    ),
  },
];

export default getAcronymsNameTableConfig;
