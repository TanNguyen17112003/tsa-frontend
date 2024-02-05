import { TOperation, useEditorRef } from "@udecode/plate-common";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Note } from "../../types/note";
import { showNote } from "../../utils";

interface ContextValue {
  notes: Note[];
  activeNoteId: string;
  setActiveNoteId: (noteId: string) => void;
  addNote: (noteId: string, note: string) => void;
  updateNote: (noteId: string, note: string) => void;
  deleteNote: (noteId: string) => void;
}

export const NotesContext = createContext<ContextValue>({
  notes: [],
  activeNoteId: "",
  setActiveNoteId: () => {},
  addNote: () => {},
  updateNote: () => {},
  deleteNote: () => {},
});

const NotesProvider = ({
  children,
  notes,
  onChangeActiveNoteId,
  onUpdateNotes,
}: {
  children: ReactNode;
  notes: Note[];
  onChangeActiveNoteId: (noteId: string) => void;
  onUpdateNotes: (notes: Note[]) => void;
}) => {
  const [activeNoteId, setActiveNoteId] = useState("");
  const editor = useEditorRef();

  const handleChange = useCallback(
    (noteId: string) => {
      setActiveNoteId(noteId);
      onChangeActiveNoteId(noteId);
      showNote(editor, noteId);
    },
    [editor, onChangeActiveNoteId]
  );

  const addNote = useCallback(
    (noteId: string, note: string) => {
      onUpdateNotes([...notes, { id: noteId, note }]);
    },
    [notes, onUpdateNotes]
  );

  const updateNote = useCallback(
    (noteId: string, value: string) => {
      onUpdateNotes(
        notes.map((note) =>
          note.id == noteId ? { ...note, note: value } : note
        )
      );
    },
    [notes, onUpdateNotes]
  );

  const deleteNote = useCallback(
    (noteId: string) => {
      onUpdateNotes(notes.filter((note) => note.id != noteId));
    },
    [notes, onUpdateNotes]
  );

  useEffect(() => {
    const { apply } = editor;
    const newApply = (o: TOperation) => {
      if (o.type == "remove_text") {
        const mark: any = editor.getMarks();
        if (mark && mark.noteId && mark.superscript) {
          return;
        }
      } else if (
        o.type == "remove_node" &&
        o.node.noteId &&
        o.node.superscript
      ) {
        return;
      }
      apply(o);
    };
    editor.apply = newApply;
    return () => {
      editor.apply = apply;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log("notes", notes);

  return (
    <NotesContext.Provider
      value={{
        notes,
        setActiveNoteId: handleChange,
        activeNoteId,
        addNote,
        updateNote,
        deleteNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotesContext = () => useContext(NotesContext);

export default NotesProvider;
