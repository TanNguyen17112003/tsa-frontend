import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { CustomTableConfig } from "src/components/custom-table";
import { Circa } from "src/types/circas";

const getCircasTableConfig = ({
  onClickDelete,
  onClickEdit,
}: {
  onClickDelete: (data: Circa) => void;
  onClickEdit: (data: Circa) => void;
}): CustomTableConfig<Circa["id"], Circa>[] => [
  {
    key: "name",
    headerLabel: "Niên đại",
    type: "string",
  },
  {
    key: "time",
    headerLabel: "Thời gian",
    type: "string",
    renderCell: (data) => (
      <div>
        {data.start_year}-{data.end_year}
      </div>
    ),
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

export default getCircasTableConfig;
