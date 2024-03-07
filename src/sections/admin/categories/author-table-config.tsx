import { CustomTableConfig } from "src/components/custom-table";
import { Author } from "src/types/author";
import { MdDelete } from "react-icons/md";

const getAccountTableConfig = ({
  onClickDelete,
}: {
  onClickDelete: (data: Author) => void;
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
    renderCell: () => <MdDelete style={{ fontSize: "1.3rem" }} />,
  },
];

export default getAccountTableConfig;
