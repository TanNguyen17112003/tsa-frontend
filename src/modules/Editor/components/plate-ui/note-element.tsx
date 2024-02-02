import { cn } from "@udecode/cn";
import { PlateLeaf, TText, withRef } from "@udecode/plate-common";
import { useCallback, useRef } from "react";
import { getBlockPath } from "../../utils";
import { NOTE_BUTTON_ID } from "../../configs";
import { MouseEvent } from "react";

export const NoteElement = withRef<typeof PlateLeaf, TText>(
  ({ className, children, ...props }, ref) => {
    const spanRef = useRef<HTMLElement | null>(null);

    const handleClick = useCallback(
      async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const path = getBlockPath(
          props.editor.children,
          children.props.leaf.noteId
        );

        if (path) {
          props.editor.select({
            anchor: {
              path,
              offset: 0,
            },
            focus: {
              path,
              offset: 1,
            },
          });
        }
        const sel = window.getSelection();
        sel?.removeAllRanges();
        if (spanRef.current) {
          spanRef.current.focus();
          const range = document.createRange();
          range.selectNodeContents(spanRef.current);
          sel?.addRange(range);
        }
      },
      [children.props.leaf.noteId, props.editor]
    );

    return (
      <PlateLeaf
        ref={ref}
        asChild
        className={cn(className)}
        {...props}
        style={{
          fontSize: 14,
          marginRight: children.props.leaf.noteIndex.toString().length * 8 + 4,
          marginLeft: 2,
          ...props,
        }}
      >
        <span className="relative -translate-y-2">
          <span ref={spanRef} style={{ fontSize: 0 }}>
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
