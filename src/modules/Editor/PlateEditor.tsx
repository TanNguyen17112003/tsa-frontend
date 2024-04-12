import {
  Plate,
  TNodeEntry,
  TRenderLeafProps,
  TText,
  Value,
} from "@udecode/plate-common";
import { BaseSelection, Range as SlateRange, Text as SlateText } from "slate";
import { Editor } from "./components/plate-ui/editor";
import { FixedToolbar } from "./components/plate-ui/fixed-toolbar";
import { FixedToolbarButtons } from "./components/plate-ui/fixed-toolbar-buttons";
import { FloatingToolbar } from "./components/plate-ui/floating-toolbar";
import plugins from "./plugins";

import clsx from "clsx";
import { useCallback, type FC, useState, useRef, useEffect } from "react";
import NoteCard from "./components/NoteCard";
import NotesProvider from "./components/NoteProvider/NoteProvider";
import { EditorFormat, EditorHighlight } from "./types";
import { Note } from "./types/note";
import { DetectDataSelected } from "./components/plate-ui/detect-data-selected";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "src/components/shadcn/ui/context-menu";
import OrisonEditorPopup from "src/sections/admin/orisons/OrisonEditorPopup";
import Menu from "./components/Menu";

interface PlateEditorProps {
  initialValue: any;
  searchText?: string;
  numElement?: number;
  notes?: Note[];
  readOnly?: boolean;
  onUpdateNotes: (notes: Note[]) => void;
  onCancel?: () => void;
  onSave?: (value: any) => void;
  onChange: (value: any) => void;
  setDataReport?: (value: string) => void;
  setSelectionReport?: (value: BaseSelection) => void;
}

const PlateEditor: FC<PlateEditorProps> = ({
  initialValue,
  searchText,
  numElement,
  readOnly,
  notes,
  onUpdateNotes,
  onChange,
  onCancel,
  onSave,
  setDataReport,
  setSelectionReport,
}) => {
  const [activeNoteId, setActiveNoteId] = useState("");
  const valueRef = useRef<any | null>();
  const [data, setData] = useState<string>("");
  const [selection, setSelection] = useState<BaseSelection>();
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

  const handleChange = useCallback(
    (value: any) => {
      onChange(value);
      valueRef.current = value;
    },
    [onChange]
  );

  useEffect(() => {
    if (setDataReport) setDataReport(data);
    if (selection && setSelectionReport) setSelectionReport(selection);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection, data]);

  useEffect(() => {
    setTimeout(() => {
      const el = document?.querySelectorAll(".search-node");
      if (el) {
        el[numElement || 0]?.scrollIntoView({ behavior: "smooth" });
      }
    }, 500);
  }, [searchText, numElement]);

  return (
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
        <DetectDataSelected setData={setData} setSelection={setSelection} />
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
          <Menu data={data} />
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
