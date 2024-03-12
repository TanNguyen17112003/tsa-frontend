import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { CustomTableConfig } from "src/components/custom-table";
import { Button } from "src/components/shadcn/ui/button";
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

export default getCircasTableConfig;
