import * as yup from "yup";

export interface Circa {
  id: string;
  circa: string; // niên đại
  start_year: number;
  end_year: number;
}

export interface CircaDetail extends Circa {}

export const circaSchema = yup.object().shape({
  circa: yup.string().required("Vui lòng nhập niên đại"),
  start_year: yup.number().required("Vui lòng nhập năm bắt đầu"),
  end_year: yup.number().required("Vui lòng nhập năm kết thúc"),
});

export const initialCirca: CircaDetail = {
  id: "",
  circa: "",
  start_year: 0,
  end_year: 0,
};
