import {
  MARK_BOLD,
  MARK_ITALIC,
  MARK_UNDERLINE,
} from "@udecode/plate-basic-marks";
import { useEditorReadOnly, useEditorRef } from "@udecode/plate-common";
import {
  BiAlignLeft,
  BiAlignMiddle,
  BiAlignRight,
  BiBold,
  BiItalic,
  BiUnderline,
} from "react-icons/bi";

import {
  useAlignDropdownMenu,
  useAlignDropdownMenuState,
} from "@udecode/plate-alignment";
import { MarkToolbarButton } from "./mark-toolbar-button";
import { ToolbarButton, ToolbarGroup } from "./toolbar";
import clsx from "clsx";
import Autocomplete from "src/components/Autocomplete";

const alignmentItems = [
  {
    value: "left",
    tooltip: "Align left",
    icon: BiAlignLeft,
  },
  {
    value: "center",
    tooltip: "Align center",
    icon: BiAlignMiddle,
  },
  {
    value: "right",
    tooltip: "Align right",
    icon: BiAlignRight,
  },
];

export function FixedToolbarButtons() {
  const readOnly = useEditorReadOnly();
  const state = useAlignDropdownMenuState();
  const { radioGroupProps } = useAlignDropdownMenu(state);
  radioGroupProps.onValueChange;
  const editor = useEditorRef();

  console.log("state, radioGroupProps", state, radioGroupProps);

  return (
    <div className="w-full overflow-hidden">
      <div
        className="flex flex-wrap"
        style={{
          transform: "translateX(calc(-1px))",
        }}
      >
        {!readOnly && (
          <>
            <div className="grow" />
            <ToolbarGroup noSeparator>
              <MarkToolbarButton
                tooltip="Bold (⌘+B)"
                nodeType={MARK_BOLD}
                className="border-2 py-3 px-4"
              >
                <BiBold />
              </MarkToolbarButton>
              <MarkToolbarButton
                tooltip="Italic (⌘+I)"
                nodeType={MARK_ITALIC}
                className="border-2 py-3 px-4"
              >
                <BiItalic />
              </MarkToolbarButton>
              <MarkToolbarButton
                tooltip="Underline (⌘+U)"
                nodeType={MARK_UNDERLINE}
                className="border-2 py-3 px-4"
              >
                <BiUnderline size={0} />
              </MarkToolbarButton>
            </ToolbarGroup>
            <ToolbarGroup noSeparator>
              {alignmentItems.map((item) => (
                <ToolbarButton
                  tooltip={item.tooltip}
                  className={clsx("border-2 py-3 px-4")}
                  pressed={item.value == state.value}
                  key={item.value}
                  onClick={() => radioGroupProps.onValueChange(item.value)}
                >
                  {<item.icon />}
                </ToolbarButton>
              ))}
            </ToolbarGroup>
            <ToolbarGroup noSeparator>
              <div className="w-[300px]">
                <Autocomplete
                  options={Array(10)
                    .fill(0)
                    .map((_, index) => ({
                      value: index,
                      label: index.toString(),
                    }))}
                  onChange={(value) => console.log("value", value)}
                ></Autocomplete>
              </div>
            </ToolbarGroup>
          </>
        )}
      </div>
    </div>
  );
}
