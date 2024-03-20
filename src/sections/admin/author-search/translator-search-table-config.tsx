import { CustomTableConfig } from "src/components/custom-table";
import { Orison } from "src/types/orison";

const getTranslatorSearchTableConfig = ({
  getCollection,
  getTranslator,
  getSutra,
}: {
  getCollection: (id: string) => string;
  getTranslator: (id: string) => string;
  getSutra: (id: string) => string;
}): CustomTableConfig<Orison["id"], Orison>[] => [
  {
    key: "translator.full_name",
    headerLabel: "Tên dịch giả",
    type: "string",
    renderCell: (data) => <div>{getTranslator(data.volume_id)}</div>,
  },
  {
    key: "collection",
    headerLabel: "Tuyển tập kinh",
    type: "string",
    renderCell: (data) => <div>{getCollection(data.volume_id)}</div>,
  },
  {
    key: "code",
    headerLabel: "Bộ kinh",
    type: "string",
    renderCell: (data) => <div>{getSutra(data.volume_id)}</div>,
  },
  {
    key: "name",
    headerLabel: "Bài kinh",
    type: "string",
  },
];

export default getTranslatorSearchTableConfig;
