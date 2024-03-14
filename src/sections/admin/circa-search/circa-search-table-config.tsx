import { CustomTableConfig } from "src/components/custom-table";
import { Sutra } from "src/types/sutra";

const getCircaSearchTableConfig: CustomTableConfig<Sutra["id"], any>[] = [
  {
    key: "name",
    headerLabel: "Bộ kinh",
    type: "string",
  },
  {
    key: "circa",
    headerLabel: "Niên đại",
    type: "string",
    renderCell: (data) => (
      <div>
        {data.circa.start_year} TCN - {data.circa.end_year} TCN
      </div>
    ),
  },
];

export default getCircaSearchTableConfig;
