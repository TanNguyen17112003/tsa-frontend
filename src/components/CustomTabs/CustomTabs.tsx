import type { FC } from "react";
import { Tabs, TabsList, TabsTrigger } from "../shadcn/ui/tabs";
import { TabsProps } from "@radix-ui/react-tabs";

export interface TabOption {
  value: string;
  label: string;
}

export interface CustomTabsProps extends TabsProps {
  options: TabOption[];
}

const CustomTabs: FC<CustomTabsProps> = ({ options, ...props }) => {
  return (
    <Tabs {...props}>
      <TabsList>
        {options.map((option) => (
          <TabsTrigger key={option.value} value={option.value}>
            {option.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default CustomTabs;
