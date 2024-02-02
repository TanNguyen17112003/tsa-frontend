import { useEffect, type FC, useRef } from "react";
import { useNotesContext } from "../NoteProvider/NoteProvider";
import { actionAsyncStorage } from "next/dist/client/components/action-async-storage.external";

interface NoteCardProps {
  noteIndex: number;
}

const NoteCard: FC<NoteCardProps> = ({ noteIndex }) => {
  const { activeNoteId, notes } = useNotesContext();
  const ref = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const note = notes.find((note) => note.id == activeNoteId);
    if (ref.current) {
      ref.current.value = note?.note || "";
    }
  }, [activeNoteId, notes]);

  return (
    <div className="inline-flex flex-col items-start gap-2 px-2 py-3 relative rounded-lg">
      <div className="flex items-center gap-2 relative self-stretch w-full">
        <div className="relative flex-1 text-lg">Chú thích [{noteIndex}]</div>
        <div className="btn btn-error btn-xs text-white">Xoá</div>
        <div className="btn btn-xs">Huỷ</div>
        <div className="btn btn-primary btn-xs text-white">Lưu</div>
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
