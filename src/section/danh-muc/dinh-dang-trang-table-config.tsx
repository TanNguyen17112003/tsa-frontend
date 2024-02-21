import { CustomTableConfig } from "src/components/custom-table";
import { Format } from "src/types/formats";

const getFormatTableConfig: CustomTableConfig<Format["id"], Format>[] = [
  {
    key: "formats_page_name",
    headerLabel: "Tên định dạng trang",
    type: "string",
  },
  {
    key: "formats_page",
    headerLabel: "Định dạng",
    type: "string",
  },
];

export default getFormatTableConfig;
