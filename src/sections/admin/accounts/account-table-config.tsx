import { CustomTableConfig } from "src/components/custom-table";
import { User } from "src/types/user";

const getAccountTableConfig = ({
  onClickDelete,
}: {
  onClickDelete: (data: User) => void;
}): CustomTableConfig<User["id"], User>[] => [
  {
    key: "name",
    headerLabel: "Họ và tên",
    type: "string",
  },
  {
    key: "email",
    headerLabel: "Email",
    type: "string",
  },
  {
    key: "username",
    headerLabel: "Tên tài khoản",
    type: "string",
  },
  {
    key: "password",
    headerLabel: "Mật khẩu",
    type: "string",
  },
  {
    key: "id",
    headerLabel: "Số bài phụ trách",
    type: "number",
  },
  {
    key: "role",
    headerLabel: "Phân quyền",
    type: "string",
  },
];

export default getAccountTableConfig;
