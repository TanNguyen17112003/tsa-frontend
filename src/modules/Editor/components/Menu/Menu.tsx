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
import OrisonComplainDialog from "src/modules/Collection/components/pages/explore/OrisonPage/OrisonCompainDialog";
import { getSelectionText, useEditorState } from "@udecode/plate-common";
import { getPageMark } from "../../utils";
import { useSutrasContext } from "src/contexts/sutras/sutras-context";
import { useVolumesContext } from "src/contexts/volumes/volumes-context";
import { useOrisonsContext } from "src/contexts/orisons/orisons-context";
import { useAuth } from "src/hooks/use-auth";

interface MenuProps {
  text: string;
}

const Menu: FC<MenuProps> = ({text}) => {
  const { collection } = useSutrasContext();
  const { sutra } = useVolumesContext();
  const { user } = useAuth();
  const { volume, getOrisonDetailApi } = useOrisonsContext();
  const { activeNoteId, notes } = useNotesContext();
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const editor = useEditorState();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isComplainOpen, setIsComplainOpen] = useState<boolean>(false);
  const [titleDialog, setTitleDialog] = useState<string>("");
  const [contentDialog, setContentDialog] = useState<string>("");

  const note = useMemo(() => {
    return notes.find((note) => note.id == activeNoteId);
  }, [activeNoteId, notes]);

  const selectionText = useMemo(() => getSelectionText(editor), [editor]);

  const handleClickCount = useCallback(() => {
    setIsOpen(true);
    setTitleDialog("Đếm số từ");
    setContentDialog("Số từ đã đếm trong khu vực bôi đen là:");
  }, []);

  const handleClickQuote = useCallback(() => {
    setIsOpen(true);
    setTitleDialog("Trích dẫn nguồn");
    const pageMark = getPageMark(editor);
    setContentDialog(
      `(${collection?.code || ""}, ${sutra?.code || ""}, ${
        volume?.code || ""
      }, ${getOrisonDetailApi.data?.code || ""}, ${pageMark || ""} )`
    );
  }, [
    collection?.code,
    editor,
    getOrisonDetailApi.data?.code,
    sutra?.code,
    volume?.code,
  ]);
  const handleClickComplain = useCallback(() => {
    setIsComplainOpen(true);
  }, [])
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
          <div className="relative flex flex-col items-start text-lg">
            <Button
              variant={"ghost"}
              className="text-primary text-lg font-normal"
              onClick={handleClickCount}
            >
              Đếm số từ
            </Button>
            <Button
              variant={"ghost"}
              className="text-primary text-lg font-normal"
              onClick={handleClickQuote}
            >
              Trích dẫn nguồn
            </Button>
            {
              (user?.role == "user" || user?.role == "translator") && (
                <Button
              variant={"ghost"}
              className="text-primary text-lg font-normal"
              onClick={handleClickComplain}
            >
              Khiếu nại
            </Button>
              )
            }
          </div>
          <OrisonEditorPopup
            state={isOpen}
            onClose={() => setIsOpen(false)}
            data={text}
            contentDialog={contentDialog}
            titleDialog={titleDialog}
          />
          <OrisonComplainDialog
            isOpen={isComplainOpen}
            onClose={() => setIsComplainOpen(false)}
            data={""}
            selection={editor.selection}
            orisonId={volume?.id}
          />
        </div>
      )}
    </div>
  );
};

export default Menu;
