import { CustomTableConfig } from "src/components/custom-table";
import { User, UserDetail } from "src/types/user";

const getAccountTableConfig = ({
  onClickDelete,
}: {
  onClickDelete: (data: User) => void;
}): CustomTableConfig<UserDetail["id"], UserDetail>[] => [
  {
    key: "full_name",
    headerLabel: "Họ và tên",
    type: "string",
  },
  {
    key: "email",
    headerLabel: "Email",
    type: "string",
  },
  {
    key: "user_name",
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
