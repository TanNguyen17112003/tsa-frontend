import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { Note } from "../../types/note";

interface ContextValue {
  notes: Note[];
  onChangeActiveNoteId: (noteId: string) => void;
  activeNoteId: string;
}

export const NotesContext = createContext<ContextValue>({
  notes: [],
  onChangeActiveNoteId: () => {},
  activeNoteId: "",
});

const NotesProvider = ({
  children,
  notes,
  onChangeActiveNoteId,
}: {
  children: ReactNode;
  notes: Note[];
  onChangeActiveNoteId: (noteId: string) => void;
}) => {
  const [activeNoteId, setActiveNoteId] = useState("");

  const handleChange = useCallback(
    (noteId: string) => {
      setActiveNoteId(noteId);
      onChangeActiveNoteId(noteId);
    },
    [onChangeActiveNoteId]
  );

  return (
    <NotesContext.Provider
      value={{ notes, onChangeActiveNoteId: handleChange, activeNoteId }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotesContext = () => useContext(NotesContext);

export default NotesProvider;
