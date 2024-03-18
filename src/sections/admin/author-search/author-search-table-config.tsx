import { useEffect, useMemo } from "react";
import { CollectionsApi } from "src/api/collections";
import { CustomTableConfig } from "src/components/custom-table";
import { useCollectionsContext } from "src/contexts/collections/collections-context";
import useFunction from "src/hooks/use-function";
import { Sutra } from "src/types/sutra";

const GetCollection = (id: string) => {
  const { getCollectionsApi } = useCollectionsContext();
  const collection = getCollectionsApi.data?.find(
    (item) => item.id == id
  )?.name;
  return <div>{collection}</div>;
};

const getAuthorSearchTableConfig: CustomTableConfig<Sutra["id"], Sutra>[] = [
  {
    key: "author.author",
    headerLabel: "Tên tác giả",
    type: "string",
  },
  {
    key: "collection",
    headerLabel: "Tuyển tập kinh",
    type: "string",
    renderCell: (data) => <div>{GetCollection(data.collection_id)}</div>,
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
