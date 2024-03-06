import * as yup from "yup";

export interface Author {
  id: string;
  author: string;
}

export interface AuthorDetail extends Author {}

export const authorSchema = yup.object().shape({
  author: yup.string().required("Vui lòng nhập tên tác giả"),
});

export const initialAuthor: AuthorDetail = { id: "", author: "" };
