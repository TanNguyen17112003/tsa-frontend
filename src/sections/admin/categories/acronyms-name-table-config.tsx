import { CustomTableConfig } from "src/components/custom-table";
import { Format } from "src/types/formats";

const getAcronymsNameTableConfig: CustomTableConfig<Format["id"], Format>[] = [
  {
    key: "acronyms_name",
    headerLabel: "Tên viết tắt tuyển tập",
    type: "string",
  },
  {
    key: "acronyms_name_full",
    headerLabel: "Tên đầy đủ tuyển tập",
    type: "string",
  },
];

export default getAcronymsNameTableConfig;
