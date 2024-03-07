import { CustomTableConfig } from "src/components/custom-table";
import { FormatSutra } from "src/types/format-sutra";

const getAcronymsNameTableConfig: CustomTableConfig<
  FormatSutra["id"],
  FormatSutra
>[] = [
  {
    key: "short",
    headerLabel: "Tên viết tắt tuyển tập",
    type: "string",
  },
  {
    key: "full",
    headerLabel: "Tên đầy đủ tuyển tập",
    type: "string",
  },
];

export default getAcronymsNameTableConfig;
