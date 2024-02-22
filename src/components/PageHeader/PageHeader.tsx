import { ReactNode } from "react";
import { Button } from "../shadcn/ui/button";
import Link from "next/link";

const PageHeader = ({
  title,
  buttonLabel,
  link,
  tabs,
}: {
  title: string;
  buttonLabel?: string;
  link?: string;
  tabs?: ReactNode;
}) => {
  return (
    <div className="w-full divide-y">
      <div className="w-full">
        <div className="flex items-center w-full">
          <div className="text-2xl font-semibold">{title}</div>
          {link && (
            <Link
              href={link}
              className="flex ml-auto text-orange-500 text-nowrap hover:bg-orange-200 rounded-lg"
            >
              <Button className=" bg-[#F97316] py-[22px] px-[16px] rounded-lg text-white text-nowrap">
                {buttonLabel}
              </Button>
            </Link>
          )}
        </div>
        <div>{tabs}</div>
      </div>
      <div></div>
    </div>
  );
};

export default PageHeader;
