import { CustomTableConfig } from "src/components/custom-table";
import { FormatSutra } from "src/types/format-sutra";

const getAcronymsNameTableConfig: CustomTableConfig<
  FormatSutra["id"],
  FormatSutra
>[] = [
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
