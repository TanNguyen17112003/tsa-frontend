import { IStylesOptions } from "docx";

export const docStyle: IStylesOptions = {
  default: {
    heading1: {
      run: {
        size: "16pt",
        bold: true,
      },
      paragraph: {
        spacing: {
          after: 120,
        },
      },
    },
    heading2: {
      run: {
        size: "13pt",
        bold: true,
      },
      paragraph: {
        spacing: {
          before: 240,
          after: 120,
        },
      },
    },
    heading3: {
      run: {
        size: "12pt",
        bold: true,
      },
    },
  },
};
