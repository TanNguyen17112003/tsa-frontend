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
import { useCallback, useEffect, useRef, useState, type FC } from "react";
import Menu from "./components/Menu";
import NoteCard from "./components/NoteCard";
import NotesProvider from "./components/NoteProvider/NoteProvider";
import { DetectDataSelected } from "./components/plate-ui/detect-data-selected";
import { EditorFormat, EditorHighlight, SelectionData } from "./types";
import { Note } from "./types/note";

interface PlateEditorProps {
  initialValue: any;
  searchText?: string;
  numElement?: number;
  notes?: Note[];
  readOnly?: boolean;
  scrollOffset?: number;
  onUpdateNotes?: (notes: Note[]) => void;
  onCancel?: () => void;
  onSave?: (value: any) => void;
  onChange?: (value: any) => void;
  onChangeSelection?: (selectionData: SelectionData) => void;
}

const PlateEditor: FC<PlateEditorProps> = ({
  initialValue,
  searchText,
  numElement,
  readOnly,
  notes,
  scrollOffset,
  onUpdateNotes,
  onChange,
  onCancel,
  onSave,
  onChangeSelection,
}) => {
  const [activeNoteId, setActiveNoteId] = useState("");
  const [selectionData, setSelectionData] = useState<SelectionData>();
  const valueRef = useRef<any | null>();

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

      if (searchText && SlateText.isText(node)) {
        const { text } = node;
        const parts = text.toLowerCase().split(searchText);
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
    [activeNoteId, searchText]
  );

  const handleChangeSelection = useCallback(
    (selectionData: SelectionData) => {
      onChangeSelection?.(selectionData);
      setSelectionData(selectionData);
    },
    [onChangeSelection]
  );

  const handleChange = useCallback(
    (value: any) => {
      onChange?.(value);
      valueRef.current = value;
    },
    [onChange]
  );

  useEffect(() => {
    setTimeout(() => {
      const container = document.getElementById("editor-container");
      const el = document?.querySelectorAll(".search-node")?.[numElement || 0];
      if (el) {
        const y =
          el.getBoundingClientRect().top + window.scrollY + (scrollOffset || 0);
        container?.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 500);
  }, [searchText, numElement, scrollOffset]);

  return (
    <>
    <Plate
      plugins={plugins}
      initialValue={initialValue}
      onChange={handleChange}
      readOnly={readOnly}
    >
      <NotesProvider
        notes={notes || []}
        onChangeActiveNoteId={setActiveNoteId}
        onUpdateNotes={onUpdateNotes}
      >
        <DetectDataSelected onSelectionChange={handleChangeSelection} />
        {!readOnly && (
          <FixedToolbar>
            <FixedToolbarButtons
              onCancel={onCancel}
              onSave={onSave ? () => onSave?.(valueRef.current) : undefined}
            />
          </FixedToolbar>
        )}
        <Editor
          readOnly={readOnly}
          style={{
            fontFamily: `"Times New Roman", Times, serif`,
          }}
          renderLeaf={(props) => <Leaf {...props} />}
          decorate={decorate}
          itemRef={searchText}
        />
        <FloatingToolbar>
          <NoteCard noteIndex={1} />
          <Menu text={selectionData?.text as string}/>
        </FloatingToolbar>
      </NotesProvider>
    </Plate>
    </>
    
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
        leaf.highlightNote && "bg-orange-200",
        leaf.highlightSearch && "bg-cyan-200 search-node"
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
