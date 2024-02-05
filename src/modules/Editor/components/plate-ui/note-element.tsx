import { cn } from "@udecode/cn";
import { PlateLeaf, TText, withRef } from "@udecode/plate-common";
import { MouseEvent, useCallback } from "react";
import { NOTE_BUTTON_ID } from "../../configs";
import { useNotesContext } from "../NoteProvider/NoteProvider";

export const NoteElement = withRef<typeof PlateLeaf, TText>(
  ({ className, children, ...props }, ref) => {
    const { setActiveNoteId } = useNotesContext();

    const handleClick = useCallback(
      async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setActiveNoteId(children.props.leaf.noteId);
      },
      [children.props.leaf.noteId, setActiveNoteId]
    );

    return (
      <PlateLeaf
        ref={ref}
        asChild
        className={cn(className)}
        {...props}
        style={{
          fontSize: 14,
          marginRight:
            (children.props.leaf.noteIndex || 0).toString().length * 8 + 4,
          marginLeft: 2,
          ...props,
        }}
      >
        <span className="relative -translate-y-2">
          <span
            style={{ fontSize: 0 }}
            id={`note-id-${children.props.leaf.noteId}`}
          >
            {children}
          </span>

          <button
            id={NOTE_BUTTON_ID}
            onClick={handleClick}
            className="absolute h-[18px] min-h-0 top-0 left-0 btn  btn-xs btn-primary -translate-y-2 text-xs px-0.5 py-0 bg-primary-100 hover:bg-primary-200"
          >
            {children.props.leaf.noteIndex}
          </button>
        </span>
      </PlateLeaf>
    );
  }
);
