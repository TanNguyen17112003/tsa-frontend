import { CustomTableConfig } from "src/components/custom-table";
import { Sutra } from "src/types/sutra";

const getCircaSearchTableConfig: CustomTableConfig<Sutra["id"], Sutra>[] = [
  {
    key: "name",
    headerLabel: "Bộ kinh",
    type: "string",
  },
  {
    key: "circa.name",
    headerLabel: "Niên đại",
    type: "string",
  },
];

export default getCircaSearchTableConfig;
