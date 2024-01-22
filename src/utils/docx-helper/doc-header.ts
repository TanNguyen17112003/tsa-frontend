import {
  Table,
  WidthType,
  BorderStyle,
  TableRow,
  TableCell,
  Paragraph,
  HeadingLevel,
  AlignmentType,
} from "docx";
import { FileChild } from "docx/build/file/file-child";
import { StationDetail } from "src/types/station";

export interface DocHeader {
  currentStation?: StationDetail;
  title: string;
}

export const getDocHeader = (header?: DocHeader): FileChild =>
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
            width: {
              size: 0.5,
              type: WidthType.PERCENTAGE,
            },
            children: [
              new Paragraph({
                text: `CÔNG TY CỔ PHẦN VẬT LIỆU VÀ XÂY DỰNG BÌNH DƯƠNG - ${header?.currentStation?.name}`,
                spacing: { after: 4 },
                heading: HeadingLevel.HEADING_2,
                alignment: AlignmentType.CENTER,
              }),
              new Paragraph({
                text: `${header?.currentStation?.address}`,
                heading: HeadingLevel.HEADING_2,
                alignment: AlignmentType.CENTER,
              }),
              // new Paragraph({
              //   text: `${header?.currentStation?.address}`,
              //   heading: HeadingLevel.HEADING_2,
              //   alignment: AlignmentType.CENTER,
              // }),
            ],
          }),
          new TableCell({
            width: {
              size: 0.5,
              type: WidthType.PERCENTAGE,
            },
            children: [
              new Paragraph({
                spacing: { after: 4 },
                text: `CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM`,
                heading: HeadingLevel.HEADING_2,
                alignment: AlignmentType.CENTER,
              }),
              new Paragraph({
                text: `Độc lập - Tự do - Hạnh phúc`,
                heading: HeadingLevel.HEADING_2,
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
        ],
      }),
    ],
  });
