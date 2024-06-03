import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "src/components/shadcn/ui/accordion";
import { useCallback, type FC, useMemo, useState, useEffect } from "react";
import { BsFunnel } from "react-icons/bs";
import { Button } from "src/components/shadcn/ui/button";
import { useRouter } from "next/router";
import searchTypes from "../../constants/searchTypes";

interface SearchNavigatorProps {}

const SearchNavigator: FC<SearchNavigatorProps> = ({}) => {
  const router = useRouter();
  const currentSearchType = router.query.searchType;
  const [open, setOpen] = useState("");

  const handleChange = useCallback(
    (value: string) => {
      const newQuery: any = {};
      Object.keys(router.query).forEach((key) =>
        key.startsWith("q") ? null : (newQuery[key] = router.query[key])
      );
      router.replace({
        pathname: router.pathname,
        query: { ...newQuery, searchType: value },
      });
    },
    [router]
  );

  const acceptSearchTypes = useMemo(
    () =>
      searchTypes.filter(
        (searchType) =>
          !["basic", "advance", "adjacent"].includes(searchType.value)
      ),
    []
  );
  useEffect(() => {
    if (router.query.searchType) {
      setOpen("item");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Accordion
      type="single"
      // collapsible={router.query.searchType ? false : true}
      className="w-full"
      value={open}
      onValueChange={() => setOpen(open ? "" : "item")}
    >
      <AccordionItem value="item" className="border-b-0">
        <AccordionTrigger
          className="bg-primary text-white px-3 py-3 rounded-md"
          onClick={() => {
            setOpen(open ? "" : "item");
          }}
        >
          <div className="flex gap-2 items-center">
            <BsFunnel />
            <div className="text-sm font-semibold">Bộ lọc</div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pt-2 pb-0">
          <div className="bg-slate-50 rounded-md p-2 flex flex-col gap-2">
            {acceptSearchTypes.map((searchType) => (
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
