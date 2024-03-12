import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { CustomTableConfig } from "src/components/custom-table";
import { User, UserDetail } from "src/types/user";

const getAccountTableConfig = ({
  onClickDelete,
  onClickEdit,
}: {
  onClickDelete: (data: User) => void;
  onClickEdit: (data: User) => void;
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
