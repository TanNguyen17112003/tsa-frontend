import { Plate } from "@udecode/plate-common";
import { Editor } from "./components/plate-ui/editor";
import { FixedToolbar } from "./components/plate-ui/fixed-toolbar";
import { FixedToolbarButtons } from "./components/plate-ui/fixed-toolbar-buttons";
import { FloatingToolbar } from "./components/plate-ui/floating-toolbar";
import plugins from "./plugins";

import type { FC } from "react";

interface PlateEditorProps {
  initialValue: any;
}

const PlateEditor: FC<PlateEditorProps> = ({ initialValue }) => {
  return (
    <Plate plugins={plugins} initialValue={initialValue}>
      <FixedToolbar>
        <FixedToolbarButtons />
      </FixedToolbar>

      <Editor />

      <FloatingToolbar></FloatingToolbar>
    </Plate>
  );
};

export default PlateEditor;
