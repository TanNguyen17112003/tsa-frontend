import * as yup from "yup";

export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  password: string;
  role: string;
  deleted_at?: null | string | Date;
}

export interface UserDetail extends User {}

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
};
