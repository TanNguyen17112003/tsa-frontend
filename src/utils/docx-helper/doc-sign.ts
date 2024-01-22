import {
  Table,
  WidthType,
  BorderStyle,
  TableRow,
  TableCell,
  Paragraph,
  AlignmentType,
  HeadingLevel,
  TextRun,
} from "docx";
import { FileChild } from "docx/build/file/file-child";

export const getSignSection = (): FileChild =>
  new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                text: "Thu ngân",
                heading: HeadingLevel.HEADING_3,
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: "(Ký và ghi rõ họ tên)", italics: true }),
                ],
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                text: "Kế toán",
                heading: HeadingLevel.HEADING_3,
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: "(Ký và ghi rõ họ tên)", italics: true }),
                ],
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                text: "Nhân viên",
                heading: HeadingLevel.HEADING_3,
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: "(Ký và ghi rõ họ tên)", italics: true }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
