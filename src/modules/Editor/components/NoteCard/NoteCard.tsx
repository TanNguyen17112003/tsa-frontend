import { useEditorRef } from "@udecode/plate-common";
import type { FC } from "react";

interface NoteCardProps {
  noteIndex: number;
}

const NoteCard: FC<NoteCardProps> = ({ noteIndex }) => {
  const editor = useEditorRef();

  console.log("editor", editor.sel);

  return (
    <div className="inline-flex flex-col items-start gap-2 px-2 py-3 relative rounded-lg">
      <div className="flex items-center gap-2 relative self-stretch w-full">
        <div className="relative flex-1 text-lg">Chú thích [{noteIndex}]</div>
        <div className="btn btn-error btn-xs text-white">Xoá</div>
        <div className="btn btn-xs">Huỷ</div>
        <div className="btn btn-primary btn-xs text-white">Lưu</div>
      </div>
      <input className="w-full" multiple />
    </div>
  );
};

export default NoteCard;
