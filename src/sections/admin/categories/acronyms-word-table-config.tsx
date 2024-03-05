import { CustomTableConfig } from "src/components/custom-table";
import { Format } from "src/types/formats";

const getAcronymsWordTableConfig: CustomTableConfig<Format["id"], Format>[] = [
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
