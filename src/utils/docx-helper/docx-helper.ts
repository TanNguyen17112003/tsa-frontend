import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TableRow,
} from "docx";
import { StationDetail } from "src/types/station";
import { ExportWorksheetField } from "../xlsx-helper";
import { docStyle } from "./style-options";
import { getDocHeader } from "./doc-header";
import { getSignSection } from "./doc-sign";
import { getDocTable } from "./doc-table";
import { getDocHelperFields } from "./doc-helper-fields";
import { printDoc } from "./docx-print";

export const generateDocument = async (
  file: File | Blob,
  data: { [name: string]: any }
): Promise<File | Blob | undefined> => {
  const doc = await new Promise<File | Blob>((resolve) => {
    let reader = new FileReader();
    reader.onload = function (e) {
      if (!reader.result) {
        throw "Lỗi tạo doc";
      }
      try {
        var zip = new PizZip(reader.result);
        var doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
        });
        doc.setData(data);
      } catch (err) {
        return;
      }
      try {
        doc.render();
      } catch (error) {
        if (error.properties && error.properties.errors instanceof Array) {
          const errorMessages = error.properties.errors
            .map(function (error: any) {
              return error.properties.explanation;
            })
            .join("\n");
          console.log("errorMessages", errorMessages);
        }
        throw error;
      }
      var out = doc.getZip().generate({
        type: "blob",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      }); //Output the document using Data-URI
      resolve(out);
    };

    reader.readAsArrayBuffer(file);
  });
  return doc;
};

export function exportReport<T extends {}>(args: {
  data: T[];
  exportFields: ExportWorksheetField<T>[];
  header?: { currentStation?: StationDetail; title: string; colSpan?: number };
  opts?: {
    indexColumn?: boolean;
    titleHelperText?: string;
    helperFields: string[];
    printSize?: string;
    lastRows?: TableRow[];
    firstRows?: TableRow[];
  };
}) {
  const { header, opts } = args;
  const doc = new Document({
    creator: "SHub Solution",
    title: header?.title,
    description: header?.title,
    styles: docStyle,
    sections: [
      {
        properties: {
          page: {
            margin: { left: "2cm", right: "2cm", top: "2cm", bottom: "2cm" },
          },
        },
        children: [
          getDocHeader(header),
          new Paragraph(""),

          new Paragraph({
            spacing: { before: 40, after: 0 },
            text: header?.title.toUpperCase(),
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            spacing: { before: 0, after: 40 },
            text: opts?.titleHelperText,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph(""),
          getDocHelperFields(opts?.helperFields || []),
          new Paragraph({ spacing: { before: 0, after: 0 } }),
          getDocTable(args),
          new Paragraph(""),
          getSignSection(),
        ],
      },
    ],
  });
  Packer.toBlob(doc).then((blob) => {
    printDoc([blob], {
      size: opts?.printSize || "A4 portrait",
      waitToLoad: 100,
      margin: "4rem",
    });
  });
}
