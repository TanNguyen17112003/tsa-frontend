import {
  PlateEditor,
  TDescendant,
  Value,
  createPlateEditor,
  deserializeHtml,
} from "@udecode/plate-common";
import plugins from "../plugins";
import _ from "lodash";
import { v4 } from "uuid";
import { ConvertDocx2EditorResult } from "../types";

export const convertDocx2Editor = async (
  file: File
): Promise<ConvertDocx2EditorResult> => {
  const container = document.createElement("div");
  container.style.display = "none";
  document.body.appendChild(container);
  const docx = await import("docx-preview");

  await docx.renderAsync(file, container, undefined, {
    inWrapper: false,
    experimental: true,
    breakPages: true,
    ignoreWidth: true,
    ignoreFonts: true,
  });

  const htmlContent = container.innerHTML;
  container.remove();

  const htmlArticleString = htmlContent.match(/<article(.*)<\/article>/g)?.[0];
  if (!htmlArticleString) {
    throw "Có lỗi khi đọc bài kinh";
  }

  const tmpEditor = createPlateEditor({ plugins });
  const blocks: any[] = deserializeHtml(tmpEditor, {
    element: htmlArticleString,
  });
  const cleanedBlocks = blocks.map((block) => cleanBlock(block));
  const noteIds: string[] = [];
  const notedBlocks: any[] = cleanedBlocks.map((block) => {
    const result = getNoteIds(block);
    noteIds.push(...result.noteIds);
    return result.block;
  });
  console.log("notedBlocks", notedBlocks);
  console.log("noteIds", noteIds);
  let htmlPos = htmlContent.indexOf("<ol>", htmlContent.indexOf("</article>"));
  const notes = noteIds.map((noteId) => {
    if (htmlPos < 0) {
      return { id: noteId, note: "" };
    }
    htmlPos = htmlContent.indexOf("<li>", htmlPos + 1);
    if (htmlPos < 0) {
      return { id: noteId, note: "" };
    }

    const noteContent = htmlContent.substring(
      htmlPos,
      htmlContent.indexOf("</li>", htmlPos)
    );
    return { id: noteId, note: extractContent(noteContent).trim() };
  });
  console.log("notes", notes);
  return {
    blocks: notedBlocks,
    notes,
    plainText: extractContent(htmlArticleString),
  };
};

/**
 * Clean and normalize blocks:
 *  - Remove duplicate text children with same format
 *  - Convert color from rgb format to hex
 * @param block from deserialize html
 * @returns cleaned blocks
 */
export const cleanBlock = (block: any): any => {
  if (!block.children) {
    return block;
  }
  const blockChildren: any[] = block.children;
  const newChildren: any[] = [];

  let currentChild: any | null = null;
  for (let i = 0; i < blockChildren.length; i++) {
    if (blockChildren[i].children || !blockChildren[i].text) {
      if (currentChild) {
        newChildren.push(currentChild);
        currentChild = null;
      }
      newChildren.push(cleanBlock(blockChildren[i]));
    } else if (
      currentChild &&
      _.isEqual(
        { ...currentChild, text: "" },
        { ...blockChildren[i], text: "" }
      )
    ) {
      currentChild.text += blockChildren[i].text || "";
    } else {
      if (currentChild) {
        newChildren.push(currentChild);
      }
      currentChild = blockChildren[i];
      currentChild.text = currentChild.text || "";
    }
  }
  if (currentChild != null) {
    newChildren.push(currentChild);
  }
  return {
    ...block,
    children: newChildren.map((child) => {
      const newChild = child;
      if (child.color) {
        child.color = rgbToHex(child.color);
      }
      if (child.superscript) {
        child.noteIndex = child.text;
        child.text = "*";
      }
      return newChild;
    }),
  };
};

/**
 * Xoá đánh dấu note khỏi content và tạo note id
 * @param block
 * @returns
 */
const getNoteIds = (block: any): { block: any; noteIds: string[] } => {
  if (!block.children) {
    return { block, noteIds: [] };
  }
  const blockChildren: any[] = block.children;
  const noteIds: string[] = [];
  const tempNewChildren = blockChildren.map((child) => {
    if (child.superscript) {
      const id = v4();
      child.noteId = id;
      noteIds.push(id);
    }
    const result = getNoteIds(child);
    noteIds.push(...result.noteIds);
    return result.block;
  });
  const newChildren: any[] = [];
  tempNewChildren.forEach((child, index) => {
    if (
      index < tempNewChildren.length - 1 &&
      tempNewChildren[index + 1].noteId
    ) {
      const text: string = child.text;
      text.trimEnd();
      const wordStartPos = text.lastIndexOf("(");
      const wordEndPos = text.lastIndexOf(")");
      if (wordEndPos == text.length - 1) {
        newChildren.push({
          ...child,
          text: text.substring(0, wordStartPos),
        });
        newChildren.push({
          ...child,
          noteId: tempNewChildren[index + 1].noteId,
          text: text.substring(wordStartPos + 1, wordEndPos),
        });
        return;
      }
    }
    newChildren.push(child);
  });
  return { block: { ...block, children: newChildren }, noteIds };
};

export const cleanHtml = (content: string) => {
  let resultContent = "";
  let pos = 0;
  while (true) {
    const spanIndex = content.indexOf("<span", pos);
    if (spanIndex >= 0) {
      resultContent += content.substring(pos, spanIndex);
      const endIndex = content.indexOf(">", pos + 1);
      const spanContent = content.substring(spanIndex, endIndex + 1);
      let closeIndex = content.indexOf("</span>", endIndex + 1);
      let textContent = content.substring(endIndex + 1, closeIndex);
      while (true) {
        const nextSpanIndex = content.indexOf(spanContent, closeIndex + 1);
        if (nextSpanIndex != closeIndex + 7) {
          break;
        }
        closeIndex = content.indexOf("</span>", nextSpanIndex + 1);
        textContent += content.substring(
          nextSpanIndex + spanContent.length + 1,
          closeIndex
        );
      }
      resultContent += spanContent + textContent + "</span>";
      pos = closeIndex + 7;
    } else {
      resultContent += content.substring(pos);
      break;
    }
  }
};

function rgbToHex(rgb: string): string {
  const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (!match) {
    return rgb;
  }

  const red = parseInt(match[1], 10);
  const green = parseInt(match[2], 10);
  const blue = parseInt(match[3], 10);

  const hexRed = red.toString(16).padStart(2, "0");
  const hexGreen = green.toString(16).padStart(2, "0");
  const hexBlue = blue.toString(16).padStart(2, "0");

  return `#${hexRed}${hexGreen}${hexBlue}`;
}

function extractContent(html: string) {
  var span = document.createElement("span");
  span.innerHTML = html;
  return span.textContent || span.innerText;
}

export const getPathByNoteId = (
  blocks: any[],
  noteId: string,
  options?: { noSuperscript?: boolean }
): number[] | null => {
  for (let i = 0; i < blocks.length; i++) {
    if (
      blocks[i].noteId == noteId &&
      (options?.noSuperscript || blocks[i].superscript)
    ) {
      return [i];
    }
    if (blocks[i].children) {
      const path = getPathByNoteId(blocks[i].children, noteId, options);
      if (path) {
        return [i, ...path];
      }
    }
  }
  return null;
};

export interface GetAllNotePathsResult {
  id: string;
  path: number[];
}

// Trả về tất cả id và path của các note trong block
export const getAllNotePaths = (
  blocks: TDescendant[],
  currentPath: number[],
  options?: { noSuperscript?: boolean }
): GetAllNotePathsResult[] => {
  const result: GetAllNotePathsResult[] = [];
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].noteId && (options?.noSuperscript || blocks[i].superscript)) {
      result.push({
        id: blocks[i].noteId as string,
        path: [...currentPath, i],
      });
    }
    if (blocks[i].children) {
      const paths = getAllNotePaths(
        blocks[i].children as TDescendant[],
        [...currentPath, i],
        options
      );
      result.push(...paths);
    }
  }
  return result;
};

export const comparePath = (a: number[], b: number[]): number => {
  const _a: number[] = [...a];
  _a.push(...Array<number>(Math.max(b.length - a.length, 0)).fill(0));
  const _b: number[] = [...b];
  _b.push(...Array(Math.max(a.length - b.length, 0)).fill(0));
  for (let i = 0; i < a.length; i++) {
    if (_a[i] < _b[i]) {
      return -1;
    }
    if (_a[i] > _b[i]) {
      return 1;
    }
  }
  return 0;
};
export const getPageMarkFromBlocks = (
  blocks: TDescendant[],
  targetPath: number[] | undefined,
  currentPath: number[]
): string => {
  if (targetPath && comparePath(currentPath, targetPath) > 0) {
    return "";
  }
  let result = "";
  blocks.forEach((block, pathIndex) => {
    if (block.text) {
      const text: string = block.text as string;
      const matches = text.match(/\[.*\]/g) || [];
      const index = matches.findLastIndex((t) => t);
      if (index >= 0) {
        result = matches[index]!;
      }
    }
    if (block.children) {
      const mark = getPageMarkFromBlocks(
        block.children as TDescendant[],
        targetPath,
        [...currentPath, pathIndex]
      );
      if (mark) {
        result = mark;
      }
    }
    if (result && !targetPath) {
      return result;
    }
  });
  return result;
};

/**
 * Trả về page mark có dạng [xxxxxxxx] gần nhất so với selection hiện tại
 * Nếu không có selection thì trả về page mark đầu tiên của bài
 * @param editor
 * @returns
 */
export const getPageMark = (editor: PlateEditor<Value>): string => {
  const selection = editor.selection;
  let mark = "";
  for (let index = 0; index < editor.children.length; index++) {
    const child = editor.children[index];
    const tmpMark = getPageMarkFromBlocks(
      child.children,
      selection?.anchor.path,
      [index]
    );
    if (tmpMark) {
      mark = tmpMark;
      if (!selection) {
        break;
      }
    }
  }
  return mark;
};

// Check block đó có chứa note
export const isContainNote = (
  blocks: TDescendant[],
  options?: { noSuperscript?: boolean }
): boolean => {
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (block.noteId && (options?.noSuperscript || block.superscript)) {
      return true;
    }
    if (block.children && isContainNote(block.children as TDescendant[])) {
      return true;
    }
  }
  return false;
};

export const getNodeByPath = (
  block: Object & { children: TDescendant[] },
  path: number[]
): TDescendant | undefined => {
  if (path.length == 0) {
    return undefined;
  }
  let node: TDescendant = block.children?.[path[0]];
  path.forEach((id) => {
    const children: TDescendant[] = node.children as TDescendant[];
    if (node.children && children[id]) {
      node = children[id];
    } else {
      return undefined;
    }
  });

  return node;
};

// Update lại stt của các note trong toàn bộ bài
export const updateNoteIndexes = (editor: PlateEditor<Value>) => {
  const paths = getAllNotePaths(editor.children, []);
  const selection = editor.selection;
  paths.forEach((path, index) => {
    editor.select({
      anchor: { path: path.path, offset: 0 },
      focus: { path: path.path, offset: 1 },
    });
    editor.addMark("noteIndex", (index + 1).toString());
  });
  if (selection) {
    editor.select(selection);
  } else {
    editor.deselect();
  }
};

// Select đoạn text của note để hiện pop-up
export const showNote = (editor: PlateEditor<Value>, noteId: string) => {
  const path = getPathByNoteId(editor.children, noteId);
  if (path) {
    editor.select({
      anchor: {
        path,
        offset: 0,
      },
      focus: {
        path,
        offset: 1,
      },
    });
  }
};
