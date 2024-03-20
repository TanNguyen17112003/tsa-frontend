import { useEffect, useMemo } from "react";
import { CollectionTreeResponse, CollectionsApi } from "src/api/collections";
import { CustomTableConfig } from "src/components/custom-table";
import { useCollectionsContext } from "src/contexts/collections/collections-context";
import useFunction from "src/hooks/use-function";
import { Orison } from "src/types/orison";
import { Sutra } from "src/types/sutra";

const getAuthorSearchTableConfig = ({
  getCollection,
  getAuthor,
  getSutra,
}: {
  getCollection: (id: string) => string;
  getAuthor: (id: string) => string;
  getSutra: (id: string) => string;
}): CustomTableConfig<Orison["id"], Orison>[] => [
  {
    key: "author",
    headerLabel: "Tên tác giả",
    type: "string",
    renderCell: (data) => <div>{getAuthor(data.volume_id)}</div>,
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

export default getAuthorSearchTableConfig;
