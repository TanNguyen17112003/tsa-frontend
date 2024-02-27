import { CustomTableConfig } from "src/components/custom-table";
import * as yup from "yup";

export interface Volume {
  id: string;
  name: string;
  code: string;
  sutras_id: string;
  created_at?: Date;
}

export interface VolumeDetail extends Volume {}

export const volumeSchema = yup.object().shape({
  name: yup.string().required("Vui lòng nhập name"),
  code: yup.string().required("Vui lòng nhập code"),
  sutras_id: yup.string().required("Vui lòng nhập sutras_id"),
});

const volumeTableConfigs: CustomTableConfig<Volume["id"], VolumeDetail>[] = [
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
    key: "sutras_id",
    headerLabel: "sutras_id",
    type: "string",
  },
  {
    key: "created_at",
    headerLabel: "created_at",
    type: "date",
  },
];

export const initialVolume: VolumeDetail = {
  id: "",
  name: "",
  code: "",
  sutras_id: "",
};
