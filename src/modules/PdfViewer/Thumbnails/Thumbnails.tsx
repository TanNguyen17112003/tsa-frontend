import clsx from "clsx";
import { useEffect, type FC } from "react";
import Item from "./Item";

interface ThumbnailsProps {
  className: string;
  images: string[];
  symbol: string;
  onPageChange?: (index: number) => void;
  selectedPage: number;
}

const Thumbnails: FC<ThumbnailsProps> = ({
  className,
  images,
  symbol,
  onPageChange,
  selectedPage,
}) => {
  useEffect(() => {
    const thumb = document.getElementById("pdf-thumb-" + selectedPage);
    if (thumb) {
      thumb.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [selectedPage]);

  useEffect(() => {
    const thumb = document.getElementById("pdf-thumb-" + selectedPage);
    if (thumb) {
      thumb.scrollIntoView({
        block: "nearest",
        inline: "center",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  return (
    <div
      className={clsx("border rounded-lg pb-[40px] overflow-y-auto", className)}
    >
      <div className="sticky top-0 bg-white z-10">
        <div className="p-3 text-lg font-semibold text-text-secondary bg-white">
          Mục lục
        </div>
        <hr />
      </div>
      <div className="grid grid-cols-2 gap-3 pt-4 px-2 bg-white">
        {images.map((image, index) => (
          <div key={index} id={"pdf-thumb-" + (index + 1)}>
            <Item
              selected={selectedPage == index + 1}
              imgSrc={image}
              onClick={() => onPageChange?.(index + 1)}
              label={symbol + (index + 1).toString().padStart(4, "0")}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Thumbnails;
