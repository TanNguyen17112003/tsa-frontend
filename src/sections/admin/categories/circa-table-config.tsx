import { CustomTableConfig } from "src/components/custom-table";
import { Circa } from "src/types/circas";

const getCircasTableConfig = ({
  onClickDelete,
}: {
  onClickDelete: (data: Circa) => void;
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
];

export default getCircasTableConfig;
