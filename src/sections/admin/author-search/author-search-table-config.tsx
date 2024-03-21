import { CustomTableConfig } from "src/components/custom-table";
import { SutraDetail } from "src/types/sutra";

const getAuthorSearchTableConfig = ({
  getCollection,
  getAuthor,
}: {
  getCollection: (id: string) => string;
  getAuthor: (id: string) => string;
}): CustomTableConfig<SutraDetail["id"], SutraDetail>[] => [
  {
    key: "author",
    headerLabel: "Tên tác giả",
    type: "string",
    renderCell: (data) => <div>{getAuthor(data.author_id)}</div>,
  },
  {
    key: "collection",
    headerLabel: "Tuyển tập kinh",
    type: "string",
    renderCell: (data) => <div>{getCollection(data.collection_id)}</div>,
  },
  {
    key: "name",
    headerLabel: "Bộ kinh",
    type: "string",
  },
];

export default getAuthorSearchTableConfig;
