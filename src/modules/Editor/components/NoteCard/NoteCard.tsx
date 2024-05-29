import { useEditorReadOnly, useEditorRef } from "@udecode/plate-common";
import { useCallback, useEffect, useRef, type FC, useMemo, useState } from "react";
import { updateNoteIndexes } from "../../utils";
import { useNotesContext } from "../NoteProvider/NoteProvider";
import { Button } from "src/components/shadcn/ui/button";

interface NoteCardProps {
  noteIndex: number;
}

const NoteCard: FC<NoteCardProps> = ({ noteIndex }) => {
  const { activeNoteId, setActiveNoteId, notes, deleteNote, updateNote } =
    useNotesContext();

  const ref = useRef<HTMLTextAreaElement | null>(null);
  const editor = useEditorRef();
  const readOnly = useEditorReadOnly();

  const note = useMemo(() => {
    return notes.find((note) => note.id == activeNoteId);
  }, [activeNoteId, notes]);
  const [textAreaValue, setTextAreaValue] = useState<string>(note?.note || "");
  const handleDelete = useCallback(() => {
    editor.removeMark("superscript");
    editor.deleteFragment();
    deleteNote(activeNoteId);
    updateNoteIndexes(editor);
    editor.set;
    setActiveNoteId("");
  }, [activeNoteId, deleteNote, editor, setActiveNoteId]);

  const handleCancel = useCallback(() => {
    editor.deselect();
    setActiveNoteId("");
  }, [editor, setActiveNoteId]);

  const handleSave = useCallback(() => {
    updateNote(activeNoteId, textAreaValue);
    editor.deselect();
  }, [activeNoteId, textAreaValue]);

  useEffect(() => {
    const currentAreaValue = textAreaValue;
    setTextAreaValue(currentAreaValue || note?.note || "");
  }, [note]);

  return (
    <>
      {activeNoteId && (
        <div className="inline-flex flex-col items-start gap-2 px-2 py-3 relative rounded-lg max-w-[400px]">
          <div className="flex items-center gap-2 relative self-stretch w-full">
            <div className="relative flex-1 text-lg">Chú thích</div>
            {!readOnly && (
              <>
                <Button variant="destructive" size="sm" onClick={handleDelete}>
                  Xoá
                </Button>
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  Huỷ
                </Button>
                <Button size="sm" onClick={handleSave}>
                  Lưu
                </Button>
              </>
            )}
          </div>
          {readOnly ? (
            <div className="w-full border rounded-lg p-2">
              <p className="text-wrap">{note?.note || ""}</p>
            </div>
          ) : (
            <textarea
              value={textAreaValue}
              onChange={(e) => setTextAreaValue(e.target.value)}
              className="w-full border min-w-[320px] rounded-lg p-2"
              rows={4}
            />
          )}
        </div>
      )}
    </>
  );
};

export default NoteCard;
