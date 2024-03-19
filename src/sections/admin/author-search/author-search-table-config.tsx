import { useEffect, useMemo } from "react";
import { CollectionsApi } from "src/api/collections";
import { CustomTableConfig } from "src/components/custom-table";
import { useCollectionsContext } from "src/contexts/collections/collections-context";
import useFunction from "src/hooks/use-function";
import { Sutra } from "src/types/sutra";

const getAuthorSearchTableConfig = ({
  getCollection,
}: {
  getCollection: (id: string) => string;
}): CustomTableConfig<Sutra["id"], Sutra>[] => [
  {
    key: "author.author",
    headerLabel: "Tên tác giả",
    type: "string",
  },
  {
    key: "collection",
    headerLabel: "Tuyển tập kinh",
    type: "string",
    renderCell: (data) => <div>{getCollection(data.collection_id)}</div>,
  },
  {
    key: "code",
    headerLabel: "Bộ kinh",
    type: "string",
  },
  {
    key: "name",
    headerLabel: "Bài kinh",
    type: "string",
  },
];

export default getAuthorSearchTableConfig;
