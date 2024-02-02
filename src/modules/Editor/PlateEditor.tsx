import {
  Plate,
  TNodeEntry,
  TRenderLeafProps,
  TText,
  Value,
} from "@udecode/plate-common";
import { Range as SlateRange, Text as SlateText } from "slate";
import { Editor } from "./components/plate-ui/editor";
import { FixedToolbar } from "./components/plate-ui/fixed-toolbar";
import { FixedToolbarButtons } from "./components/plate-ui/fixed-toolbar-buttons";
import { FloatingToolbar } from "./components/plate-ui/floating-toolbar";
import plugins from "./plugins";

import clsx from "clsx";
import { useCallback, type FC } from "react";
import NoteCard from "./components/NoteCard";
import { EditorFormat, EditorHighlight } from "./types";

interface PlateEditorProps {
  initialValue: any;
  searchText?: string;
}

const PlateEditor: FC<PlateEditorProps> = ({ initialValue, searchText }) => {
  const decorate = useCallback(
    ([node, path]: TNodeEntry): (SlateRange &
      EditorHighlight &
      EditorFormat)[] => {
      const ranges: (SlateRange & EditorHighlight)[] = [];

      if (searchText && SlateText.isText(node)) {
        const { text } = node;
        const parts = text.split(searchText);
        let offset = 0;

        parts.forEach((part, i) => {
          if (i !== 0) {
            ranges.push({
              anchor: { path, offset: offset - searchText.length },
              focus: { path, offset },
              highlightSearch: true,
            });
          }

          offset = offset + part.length + searchText.length;
        });
      }
      return ranges;
    },
    [searchText]
  );

  return (
    <Plate plugins={plugins} initialValue={initialValue}>
      <FixedToolbar>
        <FixedToolbarButtons />
      </FixedToolbar>

      <Editor renderLeaf={(props) => <Leaf {...props} />} decorate={decorate} />

      <FloatingToolbar>
        <NoteCard noteIndex={1} />
      </FloatingToolbar>
    </Plate>
  );
};

const Leaf = ({
  attributes,
  children,
  leaf,
}: TRenderLeafProps<Value, TText & EditorHighlight & EditorFormat>) => {
  return (
    <span
      {...attributes}
      style={{
        color: leaf.color,
        fontSize: leaf.fontSize,
      }}
      className={clsx(
        leaf.highlightSearch && "bg-orange-200",
        leaf.highlightNote && "bg-orange-300"
        // leaf.color && `text-[${leaf.color}]`,
        // leaf.fontSize && `text-[${leaf.fontSize}]`
        // leaf.bold && "font-bold",
        // leaf.italic && "italic",
        // leaf.underline && "underline"
      )}
    >
      {children}
    </span>
  );
};

export default PlateEditor;
