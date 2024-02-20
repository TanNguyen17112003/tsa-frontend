import { cn } from "@udecode/cn";
import { PlateLeaf, TText, withRef } from "@udecode/plate-common";
import { MouseEvent, useCallback } from "react";
import { NOTE_BUTTON_ID } from "../../configs";
import { useNotesContext } from "../NoteProvider/NoteProvider";
import { Button } from "src/components/shadcn/ui/button";

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
            (children.props.leaf.noteIndex || 0).toString().length * 8 + 12,
          marginLeft: 2,
          ...props,
        }}
      >
        <span className="relative ">
          <span
            style={{ fontSize: 0 }}
            id={`note-id-${children.props.leaf.noteId}`}
          >
            {children}
          </span>

          <Button
            variant="ghost"
            id={NOTE_BUTTON_ID}
            onClick={handleClick}
            className="absolute h-[18px] min-h-0 top-0 left-0 -translate-y-1 text-xs px-0.5 py-0 border-primary bg-primary/10 hover:bg-primary/20"
          >
            [{children.props.leaf.noteIndex}]
          </Button>
        </span>
      </PlateLeaf>
    );
  }
);
