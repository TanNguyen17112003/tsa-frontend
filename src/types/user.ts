import * as yup from "yup";
import { Permission } from "./permission";
import { Station } from "./station";

export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  password: string;
  station_type: string;
  role: string;
  permission_name: string;
  permission_role: string;
  deleted_at?: null | string | Date;
  position: string;
}

export interface UserDetail extends User {
  permissions: Permission[];
  stations: Pick<Station, "id" | "name" | "address">[];
  api_actions?: string[];
}

export const userSchema = yup.object().shape({
  username: yup.string().required("Vui lòng nhập username"),
  email: yup
    .string()
    .email("Vui lòng nhập đúng định dạng email")
    .required("Vui lòng nhập username"),
  name: yup.string().required("Vui lòng nhập name"),
  password: yup.string().required("Vui lòng nhập password"),
});

export const initialUser: UserDetail = {
  id: 0,
  username: "",
  email: "",
  name: "",
  password: "",
  role: "",
  station_type: "",
  permission_name: "",
  permission_role: "",
  position: "",
  permissions: [],
  stations: [],
};
