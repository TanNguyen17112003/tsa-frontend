import {
  Table,
  WidthType,
  TableRow,
  TableCell,
  Paragraph,
  AlignmentType,
  HeadingLevel,
  VerticalAlign,
} from "docx";
import { FileChild } from "docx/build/file/file-child";
import { getObjectValue } from "../obj-helper";
import { ExportWorksheetField } from "../xlsx-helper";
import { DocHeader } from "./doc-header";

export function getDocTable<T extends {}>({
  data,
  exportFields,
  header,
  opts,
}: {
  data: T[];
  exportFields: ExportWorksheetField<T>[];
  header?: DocHeader;
  opts?: {
    indexColumn?: boolean;
    lastRows?: TableRow[];
    firstRows?: TableRow[];
  };
}): FileChild {
  const w: number[] = [
    ...exportFields.map((e) => Math.ceil(e.label.length / 2)),
  ];
  data.map((d) => {
    exportFields.map((field, index) => {
      let value = getObjectValue(d, field.key);
      let isNumber = false;
      if (field.custom) {
        value = field.custom(d);
      }
      if (field.mapValues) {
        value = field.mapValues[value] || value;
      }
      if (typeof value == "number") {
        isNumber = true;
        value = value.toLocaleString("vi-VN");
      }
      if (value instanceof Date) {
      }
      w[index] = Math.max(w[index], String(value).length);
    });
  });
  const sum = w.reduce((prev, curr) => prev + curr, 0);
  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    rows: [
      new TableRow({
        children: [
          ...(opts?.indexColumn
            ? [
                new TableCell({
                  width: {
                    size: 20,
                    type: WidthType.DXA,
                  },
                  verticalAlign: VerticalAlign.CENTER,
                  children: [
                    new Paragraph({
                      text: "STT",
                      alignment: AlignmentType.CENTER,
                      heading: HeadingLevel.HEADING_3,
                      spacing: { before: 24, after: 24 },
                    }),
                  ],
                }),
              ]
            : []),
          ...exportFields.map(
            (e, index) =>
              new TableCell({
                verticalAlign: VerticalAlign.CENTER,
                width: {
                  size: ((w[index] || 0) * 100) / sum,
                  type: WidthType.PERCENTAGE,
                },
                children: [
                  new Paragraph({
                    text: `${e.label}`,
                    alignment: AlignmentType.CENTER,
                    heading: HeadingLevel.HEADING_3,
                    spacing: { before: 24, after: 24 },
                  }),
                ],
              })
          ),
        ],
      }),
      ...(opts?.firstRows || []),
      ...data.map(
        (d, index) =>
          new TableRow({
            children: [
              ...(opts?.indexColumn
                ? [
                    new TableCell({
                      children: [
                        new Paragraph({
                          text: (index + 1).toString(),
                          alignment: AlignmentType.CENTER,
                        }),
                      ],
                    }),
                  ]
                : []),
              ...exportFields.map((field) => {
                let value = getObjectValue(d, field.key);
                let isNumber = false;
                if (field.custom) {
                  value = field.custom(d);
                }
                if (field.mapValues) {
                  value = field.mapValues[value] || value;
                }
                if (typeof value == "number") {
                  isNumber = true;
                  value = value.toLocaleString("vi-VN");
                }
                return new TableCell({
                  margins: { left: 20, right: 20 },
                  children: [
                    new Paragraph({
                      text: value,
                      alignment: !isNumber
                        ? AlignmentType.LEFT
                        : AlignmentType.RIGHT,
                      spacing: { before: 20, after: 20 },
                    }),
                  ],
                });
              }),
            ],
          })
      ),
      ...(opts?.lastRows || []),
    ],
  });
}
