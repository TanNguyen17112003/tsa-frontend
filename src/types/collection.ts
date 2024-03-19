import _ from "lodash";
import { CollectionTreeResponse } from "src/api/collections";
import * as yup from "yup";

export interface Collection {
  id: string;
  name: string;
  code: string;
  circa: string;
  created_at?: Date;
  user_id: string;
}

export interface CollectionDetail extends Collection {
  num_authors: number;
  num_translators: number;
  num_sutras: number;
  num_orisons: number;
}

export const enrichCollection = (
  collection: Collection,
  tree: CollectionTreeResponse
): CollectionDetail => {
  const userIds: string[] = [];
  const authorIds: string[] = [];
  let numOrisons = 0;
  tree.sutras
    .filter((s) => s.collection_id == collection.id)
    .forEach((s) => {
      userIds.push(s.user_id);
      authorIds.push(s.author_id);
      const volumeIds = tree.volumes
        .filter((v) => v.sutras_id == s.id)
        .map((v) => v.id);
      const orisons = tree.orisons.filter((o) =>
        volumeIds.includes(o.volume_id)
      );
      numOrisons += orisons.length;
    });
  return {
    ...collection,
    num_authors: _.sortedUniq(authorIds.sort()).length,
    num_translators: _.sortedUniq(userIds.sort()).length,
    num_orisons: numOrisons,
    num_sutras: tree.sutras.filter((s) => s.collection_id == collection.id)
      .length,
  };
};

export const collectionSchema = yup.object().shape({
  name: yup.string().required("Vui lòng nhập name"),
  code: yup.string().required("Vui lòng nhập code"),
});

export const initialCollection: CollectionDetail = {
  id: "",
  name: "",
  code: "",
  circa: "",
  user_id: "",
  num_authors: 0,
  num_translators: 0,
  num_sutras: 0,
  num_orisons: 0,
};
