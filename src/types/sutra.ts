import * as yup from "yup";
import { Author, initialAuthor } from "./author";
import { Circa, initialCirca } from "./circas";

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

export interface SutraTransaltor {
  id: string;
  full_name: string;
}

export interface SutraDetail extends Sutra {
  num_orisons: number;
  author: Author;
  circa: Circa;
  translator: SutraTransaltor;
}

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
  num_orisons: 0,
  author: initialAuthor,
  circa: initialCirca,
  translator: { id: "", full_name: "" },
};
