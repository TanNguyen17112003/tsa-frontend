import { ReactNode } from "react";
import { Button } from "../shadcn/ui/button";
import Link from "next/link";

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
  const styleDivide = (variant == "full-divide") ? "" : "px-[10%]";
  const styleHeader = (variant == "full-divide") ? "px-7" : "";
  return (
    <div className={`pt-7 w-full divide-y ${styleDivide}`}>
      <div className={`w-full ${styleHeader}`}>
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
