import { useEditorRef } from "@udecode/plate-common";
import { useCallback, useEffect, useRef, type FC } from "react";
import { updateNoteIndexes } from "../../utils";
import { useNotesContext } from "../NoteProvider/NoteProvider";

interface NoteCardProps {
  noteIndex: number;
}

const NoteCard: FC<NoteCardProps> = ({ noteIndex }) => {
  const { activeNoteId, setActiveNoteId, notes, deleteNote, updateNote } =
    useNotesContext();
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const editor = useEditorRef();

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
    updateNote(activeNoteId, ref.current?.value || "");
    editor.deselect();
    setActiveNoteId("");
  }, [activeNoteId, editor, setActiveNoteId, updateNote]);

  useEffect(() => {
    const note = notes.find((note) => note.id == activeNoteId);
    if (ref.current) {
      ref.current.value = note?.note || "";
      // setTimeout(() => ref.current?.focus(), 200);
    }
  }, [activeNoteId, notes]);

  return (
    <div className="inline-flex flex-col items-start gap-2 px-2 py-3 relative rounded-lg">
      <div className="flex items-center gap-2 relative self-stretch w-full">
        <div className="relative flex-1 text-lg">Chú thích</div>
        <button
          className="btn btn-error btn-xs text-white"
          onClick={handleDelete}
        >
          Xoá
        </button>
        <button className="btn btn-xs" onClick={handleCancel}>
          Huỷ
        </button>
        <button
          className="btn btn-primary btn-xs text-white"
          onClick={handleSave}
        >
          Lưu
        </button>
      </div>
      <textarea
        autoFocus
        ref={ref}
        className="w-full border-[1px] min-w-[320px] rounded-lg p-1"
        rows={4}
      />
    </div>
  );
};

export default NoteCard;
