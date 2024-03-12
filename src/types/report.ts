import * as yup from "yup";
export interface Report {
  id: string;
  email: string;
  content: string;
  title: string;
  report_status: string;
  created_at: string;
  orison_id: string;
  user_id: string;
  updated_s: string;
}

export interface ReportDetail extends Report {}

export const formatReportSchema = yup.object().shape({
  email: yup
    .string()
    .email("Vui lòng nhập đúng định dạng email")
    .required("Vui lòng nhập username"),
  content: yup.string().required("Vui lòng nhập nội dung"),
  title: yup.string().required("Vui lòng nhập tiêu đề"),
});

export const initialReport: ReportDetail = {
  id: "",
  email: "",
  content: "",
  title: "",
  report_status: "",
  created_at: "",
  orison_id: "",
  user_id: "",
  updated_s: "",
};
