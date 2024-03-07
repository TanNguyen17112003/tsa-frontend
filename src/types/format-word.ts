import * as yup from "yup";

export interface FormatWord {
  id: string;
  short: string;
  full: string;
}

export interface FormatWordDetail extends FormatWord {}

export const formatWordSchema = yup.object().shape({
  short: yup.string().required("Vui lòng nhập từ đầy đủ"),
  full: yup.string().required("Vui lòng nhập từ viết tắt"),
});

export const initialFormatWord: FormatWordDetail = {
  id: "",
  short: "",
  full: "",
};
