import { CustomTableConfig } from "src/components/custom-table";
import { FormatWord } from "src/types/format-word";

const getAcronymsWordTableConfig: CustomTableConfig<
  FormatWord["id"],
  FormatWord
>[] = [
  {
    key: "acronyms_word",
    headerLabel: "Từ viết tắt",
    type: "string",
  },
  {
    key: "acronyms_word_full",
    headerLabel: "Từ đầy đủ",
    type: "string",
  },
];

export default getAcronymsWordTableConfig;
