import { ReactNode } from "react";
import { Button } from "../shadcn/ui/button";
import Link from "next/link";
import clsx from "clsx";

const PageHeader = ({
  title,
  variant,
  button,
  tabs,
}: {
  title: string;
  variant?: string;
  button?: ReactNode;
  tabs?: ReactNode;
}) => {
  return (
    <div
      className={clsx(
        "pt-7 w-full divide-y",
        variant == "full-divide" ? "" : "px-[10%]"
      )}
    >
      <div className={clsx("w-full", variant == "full-divide" ? "px-7" : "")}>
        <div className="flex pb-7 items-center w-full">
          <div className="text-2xl font-semibold">{title}</div>
          {button}
        </div>
        <div>{tabs}</div>
      </div>
      <div></div>
    </div>
  );
};

export default PageHeader;
