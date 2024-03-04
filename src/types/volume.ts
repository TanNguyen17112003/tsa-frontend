import * as yup from "yup";
import { SutraDetail, initialSutra } from "./sutra";
import { FileData, initialFileData } from "./file-data";

export interface Volume {
  id: string;
  name: string;
  code: string;
  sutras_id: string;
  created_at?: Date;
  file_id?: string;
}

export interface VolumeDetail extends Volume {
  sutra: SutraDetail;
  file?: FileData;
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
  file: initialFileData,
};
