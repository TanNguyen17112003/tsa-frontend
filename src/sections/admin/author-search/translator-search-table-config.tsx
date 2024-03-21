import { CustomTableConfig } from "src/components/custom-table";
import { SutraDetail } from "src/types/sutra";

const getTranslatorSearchTableConfig = ({
  getCollection,
  getTranslator,
}: {
  getCollection: (id: string) => string;
  getTranslator: (id: string) => string;
}): CustomTableConfig<SutraDetail["id"], SutraDetail>[] => [
  {
    key: "translator",
    headerLabel: "Tên dịch giả",
    type: "string",
    renderCell: (data) => <div>{getTranslator(data.user_id)}</div>,
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

export default getTranslatorSearchTableConfig;
