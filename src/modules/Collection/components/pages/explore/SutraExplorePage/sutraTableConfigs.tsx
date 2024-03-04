import { CustomTableConfig } from "src/components/custom-table";
import { Sutra, SutraDetail } from "src/types/sutra";

export const sutraTableConfigs: CustomTableConfig<Sutra["id"], SutraDetail>[] =
  [
    {
      key: "name",
      headerLabel: "Tên bộ kinh",
      type: "string",
    },
    {
      key: "code",
      headerLabel: "Mã bộ kinh",
      type: "string",
    },
    {
      key: "original_text",
      headerLabel: "Văn bản gốc",
      type: "string",
    },

    {
      key: "num_orisons",
      headerLabel: "Số lượng bài kinh",
      type: "number",
    },
    {
      key: "author.author",
      headerLabel: "Tác giả",
      type: "string",
    },
    {
      key: "translator.full_name",
      headerLabel: "Dịch giả",
      type: "string",
    },
    {
      key: "circa",
      headerLabel: "Niên đại",
      type: "string",
      renderCell: (data) => `${data.circa.start_year} - ${data.circa.end_year}`,
    },
  ];
