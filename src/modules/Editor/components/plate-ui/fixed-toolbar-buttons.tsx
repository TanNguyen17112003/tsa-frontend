import {
  MARK_BOLD,
  MARK_ITALIC,
  MARK_UNDERLINE,
} from "@udecode/plate-basic-marks";
import {
  focusEditor,
  setMarks,
  useEditorReadOnly,
  useEditorState,
} from "@udecode/plate-common";
import {
  BiAlignLeft,
  BiAlignMiddle,
  BiAlignRight,
  BiBold,
  BiItalic,
  BiUnderline,
} from "react-icons/bi";

import {
  useAlignDropdownMenu,
  useAlignDropdownMenuState,
} from "@udecode/plate-alignment";
import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
import { BsCardText, BsSave2 } from "react-icons/bs";
import { BaseText } from "slate";
import Autocomplete from "src/components/Autocomplete";
import { v4 } from "uuid";
import { fontSizeOptions, highlightOptions } from "../../configs";
import { EditorFormat } from "../../types";
import { isContainNote, updateNoteIndexes } from "../../utils";
import { useNotesContext } from "../NoteProvider/NoteProvider";
import { MarkToolbarButton } from "./mark-toolbar-button";
import { ToolbarButton } from "./toolbar";
import { Button } from "src/components/shadcn/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "src/components/shadcn/ui/tooltip";

const alignmentItems = [
  {
    value: "left",
    tooltip: "Align left",
    icon: BiAlignLeft,
  },
  {
    value: "center",
    tooltip: "Align center",
    icon: BiAlignMiddle,
  },
  {
    value: "right",
    tooltip: "Align right",
    icon: BiAlignRight,
  },
];

interface FixedToolbarButtonsProps {
  onSave?: () => void;
  onCancel?: () => void;
}

export function FixedToolbarButtons({
  onSave,
  onCancel,
}: FixedToolbarButtonsProps) {
  const { addNote, setActiveNoteId } = useNotesContext();
  const readOnly = useEditorReadOnly();
  const state = useAlignDropdownMenuState();
  const { radioGroupProps } = useAlignDropdownMenu(state);
  const editorState = useEditorState();
  const [selectionMark, setSelectionMark] = useState<Omit<
    BaseText & EditorFormat,
    "text"
  > | null>(null);
  const read = useEditorReadOnly();
  useEffect(() => {
    const mark = editorState.getMarks();
    if ((!mark || Object.keys(mark).length == 0) && selectionMark) {
      setMarks(editorState, selectionMark);
    } else {
      setSelectionMark(mark);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorState.selection]);

  const handleChangeFontSize = useCallback(
    (value: string) => {
      const fontSize = value.replaceAll(/[^0-9]/g, "") + "pt";
      setMarks(editorState, {
        fontSize,
        note: "abc",
      });
      setSelectionMark({ ...selectionMark, fontSize });
      focusEditor(editorState);
    },
    [editorState, selectionMark]
  );

  const handleChangeHighlight = useCallback(
    (mark: { fontSize?: string; color: string }) => {
      setMarks(editorState, mark);
      focusEditor(editorState);
    },
    [editorState]
  );

  const handleAddNote = useCallback(() => {
    const blocks = editorState.getFragment();
    const isCurrentSelectionContainNote = isContainNote(blocks);
    if (editorState.selection && !isCurrentSelectionContainNote) {
      const id = v4();
      addNote(id, "");
      const mark = editorState.getMarks();
      editorState.addMark("noteId", id);
      editorState.collapse({ edge: "end" });
      editorState.insertNode({
        ...mark,
        text: "*",
        noteId: id,
        superscript: true,
        noteIndex: "?",
      });
      updateNoteIndexes(editorState);
      setTimeout(() => setActiveNoteId(id), editorState.children.length * 2); // await editor update to create note element
    }
  }, [addNote, editorState, setActiveNoteId]);

  return (
    <div className={clsx("relative w-full", !readOnly && "py-2")}>
      <div
        className="relative flex flex-wrap items-center"
        style={{
          transform: "translateX(calc(-1px))",
        }}
      >
        {!readOnly && (
          <>
            <div className="grow" />

            <div className="flex gap-4 px-3">
              <div className="flex gap-3 items-center">
                {highlightOptions.map((highlightOption) => (
                  <TooltipProvider
                    key={highlightOption.color + highlightOption.fontSize}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          className={clsx("rounded-full w-8 h-8")}
                          style={{ backgroundColor: highlightOption.color }}
                          onClick={() => handleChangeHighlight(highlightOption)}
                        />
                      </TooltipTrigger>
                      <TooltipContent>{highlightOption.tooltip}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
              <div className="flex gap-1">
                <MarkToolbarButton
                  nodeType={MARK_BOLD}
                  className="border-[1px] py-3 px-4"
                  disabled={selectionMark?.superscript}
                >
                  <BiBold />
                </MarkToolbarButton>
                <MarkToolbarButton
                  nodeType={MARK_ITALIC}
                  className="border-[1px] py-3 px-4"
                  disabled={selectionMark?.superscript}
                >
                  <BiItalic />
                </MarkToolbarButton>
                <MarkToolbarButton
                  nodeType={MARK_UNDERLINE}
                  className="border-[1px] py-3 px-4"
                  disabled={selectionMark?.superscript}
                >
                  <BiUnderline size={0} />
                </MarkToolbarButton>
              </div>
              <div className="flex gap-1">
                {alignmentItems.map((item) => (
                  <ToolbarButton
                    className={clsx("border-[1px] py-3 px-4")}
                    pressed={item.value == state.value}
                    key={item.value}
                    onClick={() => radioGroupProps.onValueChange(item.value)}
                    disabled={selectionMark?.superscript}
                  >
                    {<item.icon />}
                  </ToolbarButton>
                ))}
              </div>
              <div className="flex gap-1 items-center">
                <Autocomplete
                  freeSolo
                  className="w-[120px]"
                  placeholder="Kích thước"
                  options={fontSizeOptions.map((fontSize) => ({
                    value: `${fontSize}pt`,
                    label: `${fontSize}pt`,
                  }))}
                  value={
                    selectionMark?.fontSize
                      ? selectionMark.fontSize.toString()
                      : undefined
                  }
                  onChange={handleChangeFontSize}
                  disabled={selectionMark?.superscript}
                ></Autocomplete>
              </div>
              <div className="flex gap-1 items-center">
                <Button variant="outline" onClick={handleAddNote}>
                  Thêm ghi chú
                  <BsCardText className="h-4 w-4 ml-2" />
                </Button>
              </div>
              <div className="flex gap-1 items-center">
                {onCancel && (
                  <Button
                    variant="ghost"
                    onClick={onCancel}
                    className="text-primary"
                  >
                    Huỷ
                  </Button>
                )}
                {onSave && (
                  <Button
                    variant="secondary"
                    onClick={onSave}
                    className="gap-2"
                  >
                    Lưu
                    <BsSave2 className="stroke-1" />
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
