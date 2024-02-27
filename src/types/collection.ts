import { CustomTableConfig } from "src/components/custom-table";
import * as yup from "yup";

export interface Collection {
  id: string;
  name: string;
  code: string;
  circa: string;
  created_at?: Date;
  user_id: string;
}

export interface CollectionDetail extends Collection {}

export const collectionSchema = yup.object().shape({
  name: yup.string().required("Vui lòng nhập name"),
  code: yup.string().required("Vui lòng nhập code"),
  circa: yup.string().required("Vui lòng nhập circa"),
  user_id: yup.string().required("Vui lòng nhập user_id"),
});

const collectionTableConfigs: CustomTableConfig<
  Collection["id"],
  CollectionDetail
>[] = [
  {
    key: "id",
    headerLabel: "id",
    type: "string",
  },
  {
    key: "name",
    headerLabel: "name",
    type: "string",
  },
  {
    key: "code",
    headerLabel: "code",
    type: "string",
  },
  {
    key: "circa",
    headerLabel: "circa",
    type: "string",
  },
  {
    key: "created_at",
    headerLabel: "created_at",
    type: "date",
  },
  {
    key: "user_id",
    headerLabel: "user_id",
    type: "string",
  },
];

export const initialCollection: CollectionDetail = {
  id: "",
  name: "",
  code: "",
  circa: "",
  user_id: "",
};
