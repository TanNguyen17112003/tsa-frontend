import { CustomTableConfig } from "src/components/custom-table";
import { Author } from "src/types/author";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { Button } from "src/components/shadcn/ui/button";

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

export default getAccountTableConfig;
