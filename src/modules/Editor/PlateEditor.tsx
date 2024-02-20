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
import { useCallback, type FC, useState } from "react";
import NoteCard from "./components/NoteCard";
import NotesProvider from "./components/NoteProvider/NoteProvider";
import { EditorFormat, EditorHighlight } from "./types";
import { Note } from "./types/note";

interface PlateEditorProps {
  initialValue: any;
  searchText?: string;
  notes?: Note[];
  onUpdateNotes: (notes: Note[]) => void;
  onChange: (value: any) => void;
}

const PlateEditor: FC<PlateEditorProps> = ({
  initialValue,
  searchText,
  notes,
  onUpdateNotes,
  onChange,
}) => {
  const [activeNoteId, setActiveNoteId] = useState("");
  const decorate = useCallback(
    ([node, path]: TNodeEntry): (SlateRange &
      EditorHighlight &
      EditorFormat)[] => {
      const ranges: (SlateRange & EditorHighlight)[] = [];

      if (activeNoteId && node.noteId == activeNoteId) {
        ranges.push({
          anchor: { path, offset: 0 },
          focus: {
            path,
            offset: typeof node.text == "string" ? node.text.length : 0,
          },
          highlightNote: true,
        });
      }

      // if (searchText && SlateText.isText(node)) {
      //   const { text } = node;
      //   const parts = text.split(searchText);
      //   let offset = 0;

      //   parts.forEach((part, i) => {
      //     if (i !== 0) {
      //       ranges.push({
      //         anchor: { path, offset: offset - searchText.length },
      //         focus: { path, offset },
      //         highlightSearch: true,
      //       });
      //     }

      //     offset = offset + part.length + searchText.length;
      //   });
      // }
      // console.log("ranges", ranges);
      return ranges;
    },
    [activeNoteId]
  );

  return (
    <Plate plugins={plugins} initialValue={initialValue} onChange={onChange}>
      <NotesProvider
        notes={notes || []}
        onChangeActiveNoteId={setActiveNoteId}
        onUpdateNotes={onUpdateNotes}
      >
        <FixedToolbar>
          <FixedToolbarButtons />
        </FixedToolbar>
        <Editor
          style={{
            fontFamily: `"Times New Roman", Times, serif`,
          }}
          renderLeaf={(props) => <Leaf {...props} />}
          decorate={decorate}
        />

        <FloatingToolbar>
          <NoteCard noteIndex={1} />
        </FloatingToolbar>
      </NotesProvider>
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
        leaf.highlightNote && "bg-orange-200"
        // leaf.highlightSearch && "bg-orange-200",
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
