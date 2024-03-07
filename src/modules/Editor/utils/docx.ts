import { TDescendant, TElement, Value } from "@udecode/plate-common";
import * as docx from "docx";

const getTextRun = (node: TDescendant): any => {
  return new docx.TextRun({
    text: node.text ? String(node.text) : undefined,
    size: node.fontSize as `${number}pt`,
    bold: node.bold as boolean,
    children: node.children
      ? (node.children as TDescendant[]).map((child) => getTextRun(child))
      : undefined,
  });
};

const getParagraph = (node: TElement) => {
  console.log("node", node);
  return new docx.Paragraph({
    spacing: { before: 200, after: 200 },
    alignment:
      node.align == "center"
        ? docx.AlignmentType.CENTER
        : node.align == "right"
        ? docx.AlignmentType.RIGHT
        : docx.AlignmentType.LEFT,
    children: node.children
      .filter((child) => !child.superscript)
      .map((child) => getTextRun(child)),
  });
};

const exportDocx = async (children: Value) => {
  const doc = new docx.Document({
    sections: [
      {
        properties: {},
        children: children.map((child) => getParagraph(child)),
      },
    ],
  });
  const blob = await docx.Packer.toBlob(doc);
  return blob;
};

export default exportDocx;
