import { Note } from "./note";

export interface EditorHighlight {
  highlightSearch?: boolean;
  highlightNote?: boolean;
}

export interface EditorFormat {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  fontSize?: number;
  color?: string;
  superscript?: boolean;
}

export interface ConvertDocx2EditorResult {
  notes: Note[];
  blocks: any[];
}
