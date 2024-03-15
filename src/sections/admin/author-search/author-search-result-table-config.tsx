import { CustomTableConfig } from "src/components/custom-table";
import { Sutra } from "src/types/sutra";

const getAuthorSearchResultTableConfig = ({
  onClickEdit,
}: {
  onClickEdit: (data: Sutra) => void;
}): CustomTableConfig<Sutra["id"], any>[] => [
  {
    key: "name",
    headerLabel: "Tên bài kinh",
    type: "string",
  },
  {
    key: "code",
    headerLabel: "Mã quyển kinh",
    type: "string",
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
    renderCell: (data) => (
      <div>
        {data.circa.start_year} TCN - {data.circa.end_year} TCN
      </div>
    ),
  },
  {
    key: "created_at",
    headerLabel: "Ngày tạo",
    type: "date",
  },
];

export default getAuthorSearchResultTableConfig;
