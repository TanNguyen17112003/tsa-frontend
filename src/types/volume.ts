import * as yup from "yup";
import { SutraDetail, initialSutra } from "./sutra";

export interface Volume {
  id: string;
  name: string;
  code: string;
  sutras_id: string;
  created_at?: Date;
}

export interface VolumeDetail extends Volume {
  sutra: SutraDetail;
}

export const volumeSchema = yup.object().shape({
  name: yup.string().required("Vui lòng nhập name"),
  code: yup.string().required("Vui lòng nhập code"),
});

export const initialVolume: VolumeDetail = {
  id: "",
  name: "",
  code: "",
  sutras_id: "",
  sutra: initialSutra,
};
