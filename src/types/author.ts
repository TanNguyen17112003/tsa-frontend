import * as yup from "yup";

export interface Author {
  id: string;
  name: string;
}

export interface AuthorDetail extends Author {}

export const authorSchema = yup.object().shape({
  name: yup.string().required("Vui lòng nhập name"),
});

export const initialAuthor: AuthorDetail = { id: "", name: "" };
