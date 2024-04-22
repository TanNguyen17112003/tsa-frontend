import { getSelectionText, useEditorState } from "@udecode/plate-common";
import { useEffect } from "react";
import { BaseSelection } from "slate";
import { getPageMark } from "../../utils";
import { SelectionData } from "../../types";

interface DetectDataSelectedProps {
  onSelectionChange: (selectionData: SelectionData) => void;
}

export function DetectDataSelected({
  onSelectionChange,
}: DetectDataSelectedProps) {
  const editorState = useEditorState();

  useEffect(() => {
    const text = getSelectionText(editorState);
    const pageMark = getPageMark(editorState);
    onSelectionChange({ selection: editorState.selection, text, pageMark });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorState.selection]);

  return <></>;
}
