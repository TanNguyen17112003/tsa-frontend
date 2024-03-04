import * as yup from "yup";

export interface FormatPage {
  id: string;
  format: string;
  name: string;
}

export interface FormatPageDetail extends FormatPage {}

export const formatPageSchema = yup.object().shape({
  format: yup.string().required("Vui lòng nhập format"),
  name: yup.string().required("Vui lòng nhập name"),
});

export const initialFormatPage: FormatPageDetail = {
  id: "",
  format: "",
  name: "",
};
