import { CustomTableConfig } from "src/components/custom-table";
import { FormatPage } from "src/types/format-page";

const getFormatTableConfig: CustomTableConfig<FormatPage["id"], FormatPage>[] =
  [
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
