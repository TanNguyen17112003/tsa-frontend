import {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import dynamic from "next/dynamic";
const PlateEditor = dynamic(() => import("src/modules/Editor"), {
  loading: () => <p>Loading...</p>,
});

import { Note } from "src/modules/Editor/types/note";
import { convertDocx2Editor } from "src/modules/Editor/utils";
import type { Page as PageType } from "src/types/page";
import { Button } from "src/components/shadcn/ui/button";

const Page: PageType = () => {
  const docxContainer = useRef<HTMLDivElement | null>(null);
  const [searchText, setSearchText] = useState("");
  const [plateValue, setPlateValue] = useState<any[]>([
    { type: "p", children: [{ text: "" }] },
  ]);
  const valueRef = useRef<any[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);

  const handleUpload: ChangeEventHandler<HTMLInputElement> = useCallback(
    async (e) => {
      const file = e.target.files?.[0];

      if (file) {
        const result = await convertDocx2Editor(file);
        setPlateValue(result.blocks);
        setNotes(result.notes);
      }
    },
    []
  );

  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem("value", JSON.stringify(valueRef.current));
      localStorage.setItem("notes", JSON.stringify(notes));
    }, 500);
    return () => clearInterval(interval);
  }, [notes]);

  useEffect(() => {
    const value: any[] = JSON.parse(localStorage.getItem("value") || "[]");
    const notes: Note[] = JSON.parse(localStorage.getItem("notes") || "[]");
    if (value.length > 0) {
      setPlateValue(value);
    }
    setNotes(notes);
  }, []);

  return (
    <div>
      <div className="flex items-center py-1 px-2">
        <input type="file" onChange={handleUpload} />
        <Button
          onClick={() => {
            setPlateValue([{ type: "p", children: [{ text: "" }] }]);
            setNotes([]);
          }}
        >
          Reset
        </Button>

        {/* <input
          className="input input-sm input-bordered w-full max-w-xs"
          placeholder="search"
          onChange={(e) => setSearchText(e.target.value)}
        /> */}
      </div>
      <hr />

      <div className="card">
        <div className="card-content">
          <PlateEditor
            key={plateValue.toString()}
            initialValue={plateValue}
            // searchText={searchText}
            notes={notes}
            onUpdateNotes={setNotes}
            onChange={(value) => {
              valueRef.current = value;
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
