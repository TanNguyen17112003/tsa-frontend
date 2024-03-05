import { CustomTableConfig } from "src/components/custom-table";
import { Orison, OrisonDetail } from "src/types/orison";

export const orisonTableConfigs: CustomTableConfig<
  Orison["id"],
  OrisonDetail
>[] = [
  {
    key: "name",
    headerLabel: "Tên bài kinh",
    type: "string",
  },
  {
    key: "code",
    headerLabel: "Mã bài kinh",
    type: "string",
  },
  {
    key: "sutra.author.author",
    headerLabel: "Tác giả",
    type: "string",
  },
  {
    key: "sutra.translator.full_name",
    headerLabel: "Dịch giả",
    type: "string",
  },
  {
    key: "sutra.circa",
    headerLabel: "Niên đại",
    type: "string",
    renderCell: (data) =>
      `${data.sutra.circa.start_year} - ${data.sutra.circa.end_year}`,
  },
  {
    key: "created_at",
    headerLabel: "Ngày tạo",
    type: "date",
  },
];
