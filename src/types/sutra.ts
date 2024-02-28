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
  circa_id: yup.string().required("Vui lòng nhập circa_id"),
  author_id: yup.string().required("Vui lòng nhập author_id"),
  user_id: yup.string().required("Vui lòng nhập user_id"),
});

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
