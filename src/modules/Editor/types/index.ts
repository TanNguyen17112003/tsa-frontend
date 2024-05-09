import { BaseSelection } from "slate";
import { Note } from "./note";

export interface EditorHighlight {
  highlightSearch?: boolean;
  highlightNote?: boolean;
}

export interface EditorFormat {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  fontSize?: number | string;
  color?: string;
  superscript?: boolean;
}

export interface ConvertDocx2EditorResult {
  notes: Note[];
  blocks: any[];
  plainText: string;
}

export interface SelectionData {
  selection: BaseSelection;
  text: string;
  pageMark: string;
}
