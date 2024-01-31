import { createPlateEditor, deserializeHtml } from "@udecode/plate-common";
import plugins from "../plugins";
import _ from "lodash";

export const convertDocx2Editor = async (file: File): Promise<any[]> => {
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

  const tmpEditor = createPlateEditor({ plugins });
  const blocks: any[] = deserializeHtml(tmpEditor, {
    element: container,
  });
  const cleanedBlocks = blocks.map((block) => cleanBlock(block));
  container.remove();
  return cleanedBlocks;
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
      // console.log("spanContent", spanContent);
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
      // console.log("textContent", textContent);
      resultContent += spanContent + textContent + "</span>";
      pos = closeIndex + 7;
    } else {
      resultContent += content.substring(pos);
      break;
    }
  }
};

export const cleanBlock = (block: any) => {
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
  return { ...block, children: newChildren };
};
