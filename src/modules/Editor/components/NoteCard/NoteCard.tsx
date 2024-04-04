import { useEditorReadOnly, useEditorRef } from "@udecode/plate-common";
import {
  useCallback,
  useEffect,
  useRef,
  type FC,
  useMemo,
  useState,
} from "react";
import { updateNoteIndexes } from "../../utils";
import { useNotesContext } from "../NoteProvider/NoteProvider";
import { Button } from "src/components/shadcn/ui/button";
import OrisonEditorPopup from "src/sections/admin/orisons/OrisonEditorPopup";

interface NoteCardProps {
  noteIndex: number;
  data: string;
}

const NoteCard: FC<NoteCardProps> = ({ noteIndex, data }) => {
  const { activeNoteId, setActiveNoteId, notes, deleteNote, updateNote } =
    useNotesContext();
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const editor = useEditorRef();
  const readOnly = useEditorReadOnly();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [titleDialog, setTitleDialog] = useState<string>("");
  const [contentDialog, setContentDialog] = useState<string>("");

  const note = useMemo(() => {
    return notes.find((note) => note.id == activeNoteId);
  }, [activeNoteId, notes]);

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
    if (ref.current) {
      ref.current.value = note?.note || "";
      // setTimeout(() => ref.current?.focus(), 200); // setTimeout to prevent unexpected scroll
    }
  }, [note]);

  return (
    <div className="inline-flex flex-col items-start gap-2 px-2 py-3 relative rounded-lg max-w-[400px]">
      {!activeNoteId ? (
        <div className="flex items-center gap-2 relative self-stretch w-full">
          <div className="relative flex-1 text-lg">
            <Button
              variant={"ghost"}
              className="text-primary text-lg font-normal"
              onClick={() => {
                setIsOpen(true);
                setTitleDialog("Đếm số từ");
                setContentDialog("Số từ đã đếm trong khu vực bôi đen là:");
              }}
            >
              Đếm số từ
            </Button>
            <div />
            <Button
              variant={"ghost"}
              className="text-primary text-lg font-normal"
              onClick={() => {
                setIsOpen(true);
                setTitleDialog("Trích dẫn nguồn");
                setContentDialog(
                  `"Một thời, đức Phật ở tại vườn của Trưởng giả Cấp-cô-độc" (VTTET 2024.V1, T001, T0001, p0001l004 )`
                );
              }}
            >
              Trích dẫn nguồn
            </Button>
          </div>
          <OrisonEditorPopup
            state={isOpen}
            onClose={() => setIsOpen(false)}
            data={data}
            contentDialog={contentDialog}
            titleDialog={titleDialog}
          />
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 relative self-stretch w-full">
            <div className="relative flex-1 text-lg">Chú thích</div>
            {activeNoteId && (
              <>
                {!readOnly && noteIndex && (
                  <>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDelete}
                    >
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
              </>
            )}
          </div>
          {activeNoteId && (
            <>
              {readOnly ? (
                <div className="w-full border rounded-lg p-2">
                  <p className="text-wrap">{note?.note || ""}</p>
                </div>
              ) : (
                <textarea
                  ref={ref}
                  className="w-full border min-w-[320px] rounded-lg p-2"
                  rows={4}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default NoteCard;
