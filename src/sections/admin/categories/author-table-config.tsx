import { CustomTableConfig } from "src/components/custom-table";
import { User } from "src/types/user";

const getAccountTableConfig = ({
  onClickDelete,
}: {
  onClickDelete: (data: User) => void;
}): CustomTableConfig<User["id"], User>[] => [
  {
    key: "name",
    headerLabel: "Tên tác giả",
    type: "string",
  },
  {
    key: "delete",
    headerLabel: "Xóa",
    type: "string",
  },
];

export default getAccountTableConfig;
