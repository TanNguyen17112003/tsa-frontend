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
import { useEffect, useMemo } from "react";

import { BaseText } from "slate";
import { NOTE_BUTTON_ID } from "../../configs";
import { EditorFormat } from "../../types";
import { Toolbar } from "./toolbar";

export const FloatingToolbar = withRef<
  typeof Toolbar,
  {
    state?: FloatingToolbarState;
  }
>(({ state, children, ...props }, componentRef) => {
  const editorRef = useEditorRef();
  const floatingToolbarState = useFloatingToolbarState({
    ...state,
    floatingOptions: {
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

  const isSelectedNote = useMemo(() => {
    const mark: (BaseText & EditorFormat) | null =
      editorRef.getMarks() as BaseText & EditorFormat;
    return mark?.superscript;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorRef.selection]);

  if (hidden || !isSelectedNote) return null;

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
