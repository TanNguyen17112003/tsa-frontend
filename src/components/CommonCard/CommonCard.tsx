import Link from "next/link";
import { PiBookOpen } from "react-icons/pi";
import { HiMiniArrowSmallRight } from "react-icons/hi2";

const CommonCard = ({
  title,
  link,
  linkLabel,
  children,
}: {
  title: string;
  link: string;
  linkLabel: string;
  children: any[];
}) => {
  return (
    <div className="p-5 border border-gray-300 rounded-3xl m-4 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold  mr-4">{title}</h2>
        <Link href="/dashboard" className="flex text-orange-500">
          Xem tất cả <HiMiniArrowSmallRight style={{ fontSize: "1.4em" }} />
        </Link>
      </div>
      {children.map((c, index) => (
        <div className="pb-4">
          <PiBookOpen style={{ fontSize: "1.4em" }} />
          <div key={index} className="text-black-700">
            {c.title}
          </div>
          <div key={index} className="text-gray-500 text-xs">
            {c.time}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommonCard;
