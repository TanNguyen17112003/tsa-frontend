import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { CustomTableConfig } from "src/components/custom-table";
import { Button } from "src/components/shadcn/ui/button";
import { FormatWord } from "src/types/format-word";

const getAcronymsWordTableConfig = ({
  onClickDelete,
  onClickEdit,
}: {
  onClickDelete: (data: FormatWord) => void;
  onClickEdit: (data: FormatWord) => void;
}): CustomTableConfig<FormatWord["id"], FormatWord>[] => [
  {
    key: "short",
    headerLabel: "Từ viết tắt",
    type: "string",
  },
  {
    key: "full",
    headerLabel: "Từ đầy đủ",
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

export default getAcronymsWordTableConfig;
