import {
  useCallback,
  useEffect,
  useRef,
  type FC,
  useMemo,
  useState,
} from "react";
import { useNotesContext } from "../NoteProvider/NoteProvider";
import { Button } from "src/components/shadcn/ui/button";
import OrisonEditorPopup from "src/sections/admin/orisons/OrisonEditorPopup";

interface MenuProps {
  data: string;
}

const Menu: FC<MenuProps> = ({ data }) => {
  const { activeNoteId, notes } = useNotesContext();
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [titleDialog, setTitleDialog] = useState<string>("");
  const [contentDialog, setContentDialog] = useState<string>("");

  const note = useMemo(() => {
    return notes.find((note) => note.id == activeNoteId);
  }, [activeNoteId, notes]);

  useEffect(() => {
    if (ref.current) {
      ref.current.value = note?.note || "";
      // setTimeout(() => ref.current?.focus(), 200); // setTimeout to prevent unexpected scroll
    }
  }, [note]);

  return (
    <div className="inline-flex flex-col items-start gap-2 px-2 py-3 relative rounded-lg max-w-[400px]">
      {!activeNoteId && (
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
      )}
    </div>
  );
};

export default Menu;
