import {
  PlateEditor,
  TOperation,
  Value,
  createPluginFactory,
} from "@udecode/plate-common";

const withCustomPlugin = <
  V extends Value = Value,
  E extends PlateEditor<V> = PlateEditor<V>
>(
  editor: E
) => {
  const { apply } = editor;
  // Prevent remove note
  editor.apply = (o: TOperation) => {
    if (o.type == "remove_text") {
      const mark: any = editor.getMarks();
      if (mark && mark.noteId && mark.superscript) {
        return;
      }
    } else if (o.type == "remove_node" && o.node.noteId && o.node.superscript) {
      return;
    }
    apply(o);
  };

  return editor;
};

const createCustomPlugin = createPluginFactory({
  key: "CUSTOM_PLUGIN",
  withOverrides: withCustomPlugin,
});

export default createCustomPlugin;
