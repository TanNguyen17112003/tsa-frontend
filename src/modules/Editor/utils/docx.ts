import { TDescendant, TElement, Value } from "@udecode/plate-common";
import * as docx from "docx";
import { Note } from "../types/note";

const getNodeNotes = (node: TDescendant): Note[] => {
  if (node.noteId) {
    return [{ id: String(node.noteId), note: String(node.note) }];
  }
  const results: Note[] = [];
  if (node.children) {
    (node.children as TDescendant[]).forEach((child) =>
      results.push(...getNodeNotes(child))
    );
  }
  return results;
};

const getTextRun = (node: TDescendant): any => {
  return new docx.TextRun({
    text: node.superscript
      ? `[${node.noteIndex}]`
      : node.text
      ? String(node.text)
      : undefined,
    size: node.fontSize as `${number}pt`,
    bold: node.bold as boolean,
    color: node.color as string,
    children: node.children
      ? (node.children as TDescendant[]).map((child) => getTextRun(child))
      : undefined,
  });
};

const getParagraph = (node: TElement) => {
  return new docx.Paragraph({
    spacing: { before: 200, after: 200 },
    alignment:
      node.align == "center"
        ? docx.AlignmentType.CENTER
        : node.align == "right"
        ? docx.AlignmentType.RIGHT
        : docx.AlignmentType.LEFT,
    children: node.children.map((child) => getTextRun(child)),
  });
};

const getSection = (node: TElement): docx.ISectionOptions => {
  const notes = getNodeNotes(node);
  return {
    children: [getParagraph(node)],
    properties: { type: docx.SectionType.CONTINUOUS },
    footers: {
      default: new docx.Footer({
        children: notes.map((note) => new docx.Paragraph(note.id)),
      }),
    },
  };
};

const exportDocx = async (children: Value) => {
  const doc = new docx.Document({
    sections: children.map((child) => getSection(child)),
  });
  const blob = await docx.Packer.toBlob(doc);
  return blob;
};

export default exportDocx;
