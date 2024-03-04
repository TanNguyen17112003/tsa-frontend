import { useEditorRef } from "@udecode/plate-common";
import { useCallback, useEffect, useRef, type FC } from "react";
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
      setTimeout(() => ref.current?.focus(), 200); // setTimeout to prevent unexpected scroll
    }
  }, [activeNoteId, notes]);

  return (
    <div className="inline-flex flex-col items-start gap-2 px-2 py-3 relative rounded-lg">
      <div className="flex items-center gap-2 relative self-stretch w-full">
        <div className="relative flex-1 text-lg">Chú thích</div>
        <Button variant="destructive" size="sm" onClick={handleDelete}>
          Xoá
        </Button>
        <Button variant="outline" size="sm" onClick={handleCancel}>
          Huỷ
        </Button>
        <Button size="sm" onClick={handleSave}>
          Lưu
        </Button>
      </div>
      <textarea
        ref={ref}
        className="w-full border-[1px] min-w-[320px] rounded-lg p-1"
        rows={4}
      />
    </div>
  );
};

export default NoteCard;
