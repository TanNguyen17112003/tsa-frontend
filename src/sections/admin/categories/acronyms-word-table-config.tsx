import { CustomTableConfig } from "src/components/custom-table";
import { FormatWord } from "src/types/format-word";

const getAcronymsWordTableConfig: CustomTableConfig<
  FormatWord["id"],
  FormatWord
>[] = [
  {
    key: "short",
    headerLabel: "Từ viết tắt",
    type: "string",
  },
  {
    key: "full",
    headerLabel: "Từ đầy đủ",
    type: "string",
  },
];

export default getAcronymsWordTableConfig;
