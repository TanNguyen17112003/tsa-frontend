import { CustomTableConfig } from "src/components/custom-table";
import { Volume, VolumeDetail } from "src/types/volume";

export const volumeTableConfigs: CustomTableConfig<
  Volume["id"],
  VolumeDetail
>[] = [
  {
    key: "name",
    headerLabel: "Tên quyển kinh",
    type: "string",
  },
  {
    key: "code",
    headerLabel: "Mã quyển kinh",
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
