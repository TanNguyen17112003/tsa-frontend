import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { CustomTableConfig } from "src/components/custom-table";
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
      <div className="flex space-x-4">
        <FaRegEdit
          onClick={() => onClickEdit(data)}
          style={{
            fontSize: "1.1rem",
            color: "deepskyblue",
            cursor: "pointer",
          }}
        />
        <RiDeleteBin6Line
          onClick={() => onClickDelete(data)}
          style={{
            fontSize: "1.1rem",
            color: "red",
            cursor: "pointer",
          }}
        />
      </div>
    ),
  },
];

export default getAcronymsWordTableConfig;
