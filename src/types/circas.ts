export interface Circa {
  id: string;
  circa: string; // niên đại
  start_year: number;
  end_year: number;
}

export interface CircaDetail extends Circa {}

export const initialCirca: CircaDetail = {
  id: "",
  circa: "",
  start_year: 0,
  end_year: 0,
};
