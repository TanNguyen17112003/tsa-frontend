import type { FC } from "react";

interface ItemProps {
  imgSrc?: string;
  label?: string;
  selected?: boolean;
  onClick: () => void;
}

const Item: FC<ItemProps> = ({ imgSrc, label, onClick, selected }) => {
  return (
    <div
      className="border rounded-sm overflow-hidden relative cursor-pointer hover:scale-105 duration-200 aspect-[2/3]"
      onClick={onClick}
    >
      {imgSrc && (
        <img
          src={imgSrc}
          alt={label}
          width="100%"
          height="100%"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      )}
      {selected && (
        <div className="w-full h-full border-4 border-cyan-500 absolute top-0 left-0"></div>
      )}
      {label && (
        <div className="bg-black/55 text-white py-3 text-sm font-semibold absolute bottom-0 left-0 w-full text-center">
          {label}
        </div>
      )}
    </div>
  );
};

export default Item;
