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

export const collectionSchema = yup.object().shape({
  name: yup.string().required("Vui lòng nhập name"),
  code: yup.string().required("Vui lòng nhập code"),
  circa: yup.string().required("Vui lòng nhập circa"),
  user_id: yup.string().required("Vui lòng nhập user_id"),
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
