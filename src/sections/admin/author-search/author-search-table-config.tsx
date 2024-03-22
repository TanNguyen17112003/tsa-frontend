import { CustomTableConfig } from "src/components/custom-table";
import { SutraDetail } from "src/types/sutra";

const getAuthorSearchTableConfig: CustomTableConfig<
  SutraDetail["id"],
  SutraDetail
>[] = [
  {
    key: "author.author",
    headerLabel: "Tên tác giả",
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

export default getAuthorSearchTableConfig;
