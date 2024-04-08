import { getSelectionText, useEditorState } from "@udecode/plate-common";
import { useEffect } from "react";
import { BaseSelection } from "slate";

interface DetectDataSelectedProps {
  setData: (value: string) => void;
  setSelection: (value: BaseSelection) => void;
}

export function DetectDataSelected({
  setData,
  setSelection,
}: DetectDataSelectedProps) {
  const editorState = useEditorState();

  useEffect(() => {
    const data = getSelectionText(editorState);
    setData(data);
    setSelection(editorState.selection);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorState.selection]);

  return <></>;
}
