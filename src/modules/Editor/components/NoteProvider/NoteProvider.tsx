import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { Note } from "../../types/note";
import { v4 } from "uuid";

interface ContextValue {
  notes: Note[];
  activeNoteId: string;
  setActiveNoteId: (noteId: string) => void;
  addNote: (note: string) => void;
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

  const handleChange = useCallback(
    (noteId: string) => {
      setActiveNoteId(noteId);
      onChangeActiveNoteId(noteId);
    },
    [onChangeActiveNoteId]
  );

  const addNote = useCallback(
    (note: string) => {
      onUpdateNotes([...notes, { id: v4(), note }]);
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
