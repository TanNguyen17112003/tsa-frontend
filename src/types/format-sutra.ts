import * as yup from "yup";

export interface FormatSutra {
  id: string;
  short: string;
  full: string;
}

export interface FormatSutraDetail extends FormatSutra {}

export const formatSutraSchema = yup.object().shape({
  short: yup.string().required("Vui lòng nhập tên đầy đủ"),
  full: yup.string().required("Vui lòng nhập tên viết tắt"),
});

export const initialFormatSutra: FormatSutraDetail = {
  id: "",
  short: "",
  full: "",
};
