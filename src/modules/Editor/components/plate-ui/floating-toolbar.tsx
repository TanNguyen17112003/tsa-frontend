"use client";

import { cn, withRef } from "@udecode/cn";
import {
  PortalBody,
  useComposedRef,
  useEditorRef,
} from "@udecode/plate-common";
import {
  FloatingToolbarState,
  flip,
  offset,
  useFloatingToolbar,
  useFloatingToolbarState,
} from "@udecode/plate-floating";

import { BaseText } from "slate";
import { NOTE_BUTTON_ID } from "../../configs";
import { EditorFormat } from "../../types";
import { Toolbar } from "./toolbar";
import { useNotesContext } from "../NoteProvider/NoteProvider";
import { useMemo, useEffect } from "react";

export const FloatingToolbar = withRef<
  typeof Toolbar,
  {
    state?: FloatingToolbarState;
  }
>(({ state, children, ...props }, componentRef) => {
  const { setActiveNoteId, activeNoteId } = useNotesContext();
  const editorRef = useEditorRef();

  const getBoundingClientRect = useMemo(() => {
    if (typeof window != "undefined") {
      const element = document.getElementById(`note-id-${activeNoteId}`);
      return element?.getBoundingClientRect.bind(element);
    }
    return undefined;
  }, [activeNoteId]);

  const floatingToolbarState = useFloatingToolbarState({
    ...state,

    floatingOptions: {
      getBoundingClientRect: activeNoteId ? getBoundingClientRect : undefined,
      placement: "top",
      middleware: [
        offset(12),
        flip({
          padding: 12,
          fallbackPlacements: [
            "top-start",
            "top-end",
            "bottom-start",
            "bottom-end",
          ],
        }),
      ],
      ...state?.floatingOptions,
    },
    ignoreReadOnly: false,
  });

  const {
    ref: floatingRef,
    props: rootProps,
    hidden,
  } = useFloatingToolbar(floatingToolbarState);

  const ref = useComposedRef<HTMLDivElement>(componentRef, floatingRef);

  useEffect(() => {
    const handleUpdate = (e: MouseEvent) => {
      const element: HTMLElement | null = e.target as HTMLElement;
      if (element?.id == NOTE_BUTTON_ID) {
        floatingToolbarState.floating.update();
      }
    };
    document.addEventListener("mouseup", handleUpdate);
    return () => window.removeEventListener("mouseup", handleUpdate);
  }, [floatingToolbarState.floating, floatingToolbarState.floating.update]);

  useEffect(() => {
    floatingToolbarState.floating.update();
  }, [activeNoteId, floatingToolbarState.floating]);

  const isSelectedNote = useMemo(() => {
    const mark: (BaseText & EditorFormat) | null =
      editorRef.getMarks() as BaseText & EditorFormat;
    if (!mark?.superscript) {
      setActiveNoteId("");
    }
    return mark?.superscript;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorRef.selection]);

  if (hidden) return null;

  return (
    <PortalBody>
      <div
        ref={ref}
        className={cn(
          "absolute z-50 whitespace-nowrap border bg-popover px-1 opacity-100 shadow-md rounded-xl print:hidden"
        )}
        {...rootProps}
        {...props}
      >
        {children}
      </div>
    </PortalBody>
  );
});
