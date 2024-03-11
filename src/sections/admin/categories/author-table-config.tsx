import { CustomTableConfig } from "src/components/custom-table";
import { Author } from "src/types/author";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";

const getAccountTableConfig = ({
  onClickDelete,
  onClickEdit,
}: {
  onClickDelete: (data: Author) => void;
  onClickEdit: (data: Author) => void;
}): CustomTableConfig<Author["id"], Author>[] => [
  {
    key: "author",
    headerLabel: "Tên tác giả",
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

export default getAccountTableConfig;
