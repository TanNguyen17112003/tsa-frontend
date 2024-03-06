import { withCn } from "@udecode/cn";

import { Toolbar } from "./toolbar";

export const FixedToolbar = withCn(
  Toolbar,
  "supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full justify-between border-b -mb-1 bg-background/95 backdrop-blur"
);
