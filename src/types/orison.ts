import { CustomTableConfig } from "src/components/custom-table";
import * as yup from "yup";
import { SutraDetail, initialSutra } from "./sutra";

export interface Orison {
  id: string;
  name: string;
  code: string;
  volume_id: string;
  created_at?: Date;
  content: string;
  updated_at?: Date;
}

export interface OrisonDetail extends Orison {
  sutra: SutraDetail;
}

export const orisonSchema = yup.object().shape({
  name: yup.string().required("Vui lòng nhập name"),
  code: yup.string().required("Vui lòng nhập code"),
});

const orisonTableConfigs: CustomTableConfig<Orison["id"], OrisonDetail>[] = [
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
    key: "volume_id",
    headerLabel: "volume_id",
    type: "string",
  },
  {
    key: "created_at",
    headerLabel: "created_at",
    type: "date",
  },
  {
    key: "content",
    headerLabel: "content",
    type: "string",
  },
  {
    key: "updated_at",
    headerLabel: "updated_at",
    type: "date",
  },
];

export const initialOrison: OrisonDetail = {
  id: "",
  name: "",
  code: "",
  volume_id: "",
  content: "",
  sutra: initialSutra,
};
