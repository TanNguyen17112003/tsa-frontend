import { ChangeEventHandler, useCallback, useRef, useState } from "react";
import PlateEditor from "src/modules/Editor";
import type { Page as PageType } from "src/types/page";
import { createPlateEditor, deserializeHtml } from "@udecode/plate-common";
import plugins from "src/modules/Editor/plugins";
import _ from "lodash";

const reduceChildren = (block: any) => {
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
      newChildren.push(reduceChildren(blockChildren[i]));
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

const Page: PageType = () => {
  const docxContainer = useRef<HTMLDivElement | null>(null);
  const [plateValue, setPlateValue] = useState<any[]>([]);

  const handleUpload: ChangeEventHandler<HTMLInputElement> = useCallback(
    async (e) => {
      const file = e.target.files?.[0];

      if (file && docxContainer.current) {
        const docx = await import("docx-preview");
        const tmpEditor = createPlateEditor({ plugins });

        await docx.renderAsync(file, docxContainer.current, undefined, {
          inWrapper: false,
          experimental: true,
          breakPages: true,
          ignoreWidth: true,
          ignoreFonts: true,
        });

        const content = docxContainer.current.innerHTML;
        let resultContent = "";
        let pos = 0;
        while (true) {
          console.log("pos", pos);
          const spanIndex = content.indexOf("<span", pos);
          if (spanIndex >= 0) {
            resultContent += content.substring(pos, spanIndex);
            const endIndex = content.indexOf(">", pos + 1);
            const spanContent = content.substring(spanIndex, endIndex + 1);
            let closeIndex = content.indexOf("</span>", endIndex + 1);
            let textContent = content.substring(endIndex + 1, closeIndex);
            // console.log("spanContent", spanContent);
            while (true) {
              const nextSpanIndex = content.indexOf(
                spanContent,
                closeIndex + 1
              );
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
        const aaa: any[] = deserializeHtml(tmpEditor, {
          element: docxContainer.current,
        });
        console.log("aaa", aaa);
        const newContent = aaa.map((value) => reduceChildren(value));
        console.log("new", newContent);
        setPlateValue(newContent);
      }
    },
    []
  );

  return (
    <div>
      <input type="file" onChange={handleUpload} />
      <div>
        <div className="hidden" ref={docxContainer} />
      </div>
      <div className="card">
        <div className="card-content">
          <PlateEditor key={plateValue.toString()} initialValue={plateValue} />
        </div>
      </div>
    </div>
  );
};

export default Page;
