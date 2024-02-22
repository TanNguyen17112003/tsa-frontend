import { FunnelIcon } from "@heroicons/react/24/solid";
import type { FC } from "react";
import { BsFunnel } from "react-icons/bs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "src/components/shadcn/ui/accordion";
import { Button } from "src/components/shadcn/ui/button";
import SearchNavigator from "./components/SearchNavigator";
import ViewNavigator from "./components/ViewNavigator";

interface CollectionProps {}

const Collection: FC<CollectionProps> = ({}) => {
  return (
    <div className="flex">
      <div className="w-[300px]">
        <div className="sticky top-0 p-3">
          <SearchNavigator />
        </div>
        <hr />
        <div className="p-4">
          <ViewNavigator />
        </div>
      </div>
      <div className="flex-1"></div>
    </div>
  );
};

export default Collection;
