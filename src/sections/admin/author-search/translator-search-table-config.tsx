import { CustomTableConfig } from "src/components/custom-table";
import { SutraDetail } from "src/types/sutra";

const getTranslatorSearchTableConfig: CustomTableConfig<
  SutraDetail["id"],
  SutraDetail
>[] = [
  {
    key: "translator.full_name",
    headerLabel: "Tên dịch giả",
    type: "string",
  },
  {
    key: "collections.name",
    headerLabel: "Tuyển tập kinh",
    type: "string",
  },
  {
    key: "name",
    headerLabel: "Bộ kinh",
    type: "string",
  },
];

export default getTranslatorSearchTableConfig;
