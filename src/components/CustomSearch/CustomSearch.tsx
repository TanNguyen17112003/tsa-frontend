
  import type { FC, ReactNode } from "react";
  import clsx from "clsx";

  
  interface CustomSearchProps {
    name: string,
    author: string,
    translator: string,
    highlight: string,
    onClick: () => void;
    startLabel: string;
  }
  
 export const CustomSearch: FC<CustomSearchProps> = ({
    name,
    author,
    translator,
    highlight,
    onClick,
    startLabel
  }) => {
    return (
        <div className="rounded-lg bg-gray-300 p-3 mb-3 cursor-pointer" onClick={onClick}>
            <h1 className="text-4xl text-white">{name}</h1>
            <div className="flex italic gap-3">
                <span>{author}</span>
                <span>{translator}</span>
                <span className="bg-yellow-300">{highlight}</span>
                <span>{startLabel}</span>
            </div>
        </div>
    );
  };
  
  