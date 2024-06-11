import { ReactNode } from "react";
import { Button } from "../shadcn/ui/button";
import Link from "next/link";
import clsx from "clsx";
import { FaArrowLeftLong } from "react-icons/fa6";

const PageHeader = ({
  title,
  variant,
  button,
  tabs,
  backLink,
  className,
}: {
  title: string;
  variant?: string;
  button?: ReactNode;
  tabs?: ReactNode;
  backLink?: string;
  className?: string;
}) => {
  return (
    <div
      className={clsx(
        "pt-7 w-full divide-y-2",
        variant == "full-divide" ? "" : "px-[10%]",
        className
      )}
    >
      <div className={clsx("w-full", variant == "full-divide" ? "px-7" : "")}>
        <div className="flex pb-7 items-center w-full">
          <div className="flex-1">
            {backLink && (
              <Button
                asChild
                variant="ghost"
                color="primary"
                size="sm"
                className="text-primary gap-2 -mt-2"
              >
                <Link href={backLink}>
                  <FaArrowLeftLong />
                  <span className="label">Quay lại</span>
                </Link>
              </Button>
            )}
            <div className="text-2xl font-semibold">{title}</div>
          </div>
          {button}
        </div>
        <div>{tabs}</div>
      </div>
      <div></div>
    </div>
  );
};

export default PageHeader;
