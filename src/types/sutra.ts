import { CustomTableConfig } from "src/components/custom-table";
import * as yup from "yup";

export interface Sutra {
  id: string;
  name: string;
  code: string;
  original_text?: string;
  created_at?: Date;
  collection_id: string;
  circa_id: string;
  author_id: string;
  user_id: string;
}

export interface SutraDetail extends Sutra {}

export const sutraSchema = yup.object().shape({
  name: yup.string().required("Vui lòng nhập name"),
  code: yup.string().required("Vui lòng nhập code"),
  original_text: yup.string().required("Vui lòng nhập original_text"),
  collection_id: yup.string().required("Vui lòng nhập collection_id"),
  circa_id: yup.string().required("Vui lòng nhập circa_id"),
  author_id: yup.string().required("Vui lòng nhập author_id"),
  user_id: yup.string().required("Vui lòng nhập user_id"),
});

const sutraTableConfigs: CustomTableConfig<Sutra["id"], SutraDetail>[] = [
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
    key: "original_text",
    headerLabel: "original_text",
    type: "string",
  },
  {
    key: "created_at",
    headerLabel: "created_at",
    type: "date",
  },
  {
    key: "collection_id",
    headerLabel: "collection_id",
    type: "string",
  },
  {
    key: "circa_id",
    headerLabel: "circa_id",
    type: "string",
  },
  {
    key: "author_id",
    headerLabel: "author_id",
    type: "string",
  },
  {
    key: "user_id",
    headerLabel: "user_id",
    type: "string",
  },
];

export const initialSutra: SutraDetail = {
  id: "",
  name: "",
  code: "",
  original_text: "",
  collection_id: "",
  circa_id: "",
  author_id: "",
  user_id: "",
};
