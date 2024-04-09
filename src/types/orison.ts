import * as yup from "yup";
import { SutraDetail, initialSutra } from "./sutra";
import { Note } from "src/modules/Editor/types/note";

export interface Orison {
  id: string;
  name: string;
  code: string;
  volume_id: string;
  plain_text: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface OrisonDetail extends Orison {
  sutra: SutraDetail;
}

export interface OrisonEditor extends Orison {
  notes: Note[];
  content: any[];
  plain_text: string;
}

export const orisonSchema = yup.object().shape({
  name: yup.string().required("Vui lòng nhập name"),
  code: yup.string().required("Vui lòng nhập code"),
});

export const initialOrison: OrisonDetail & OrisonEditor = {
  id: "",
  name: "",
  code: "",
  volume_id: "",
  content: [],
  sutra: initialSutra,
  plain_text: "",
  notes: [],
};
