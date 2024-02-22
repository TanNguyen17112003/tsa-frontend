import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "src/components/shadcn/ui/accordion";
import { useCallback, type FC } from "react";
import { BsFunnel } from "react-icons/bs";
import { Button } from "src/components/shadcn/ui/button";
import { useRouter } from "next/router";
import searchTypes from "../../constants/searchTypes";

interface SearchNavigatorProps {}

const SearchNavigator: FC<SearchNavigatorProps> = ({}) => {
  const router = useRouter();
  const currentSearchType = router.query.searchType;

  const handleChange = useCallback(
    (value: string) => {
      router.replace({
        pathname: router.pathname,
        query: { ...router.query, searchType: value },
      });
    },
    [router]
  );

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1" className="border-b-0">
        <AccordionTrigger className="bg-primary text-white px-3 py-3 rounded-md">
          <div className="flex gap-2 items-center">
            <BsFunnel />
            <div className="text-sm font-semibold">Bộ lọc</div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pt-2 pb-0">
          <div className="bg-slate-50 rounded-md p-2 flex flex-col gap-2">
            {searchTypes.map((searchType) => (
              <Button
                variant={
                  searchType.value == currentSearchType
                    ? "secondary"
                    : "outline"
                }
                className="justify-start"
                key={searchType.value}
                onClick={() => handleChange(searchType.value)}
              >
                {searchType.label}
              </Button>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default SearchNavigator;
