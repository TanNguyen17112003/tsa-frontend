import { CustomTableConfig } from "src/components/custom-table";
import { Collection, CollectionDetail } from "src/types/collection";

const collectionTableConfigs: CustomTableConfig<
  Collection["id"],
  CollectionDetail
>[] = [
  {
    key: "name",
    headerLabel: "Tên tuyển tập",
    type: "string",
  },
  {
    key: "code",
    headerLabel: "Mã tuyển tập",
    type: "string",
  },
  {
    key: "num_authors",
    headerLabel: "Số tác giả",
    type: "string",
  },
  {
    key: "num_translators",
    headerLabel: "Số dịch giả",
    type: "string",
  },
  {
    key: "num_sutras",
    headerLabel: "Số bộ kinh",
    type: "string",
  },
  {
    key: "num_orisons",
    headerLabel: "Số bài kinh",
    type: "string",
  },
  {
    key: "created_at",
    headerLabel: "Ngày tạo",
    type: "date",
  },
];

export default collectionTableConfigs;
