export interface Format {
  id: string;
  formats_page_name: string;
  formats_page: string;
  acronyms_name: string;
  acronyms_name_full: string;
  acronyms_word: string;
  acronyms_word_full: string;
}

export interface FormatDetail extends Format {}

export const initialFormat: FormatDetail = {
  id: "",
  formats_page_name: "",
  formats_page: "",
  acronyms_name: "",
  acronyms_name_full: "",
  acronyms_word: "",
  acronyms_word_full: "",
};
