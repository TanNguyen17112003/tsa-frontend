import { useRouter } from "next/router";
import { useCallback, useMemo, type FC } from "react";
import { useCollectionTreeContext } from "./CollectionTree";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./CollectionTreeAccordion";
import SutraItems from "./SutraItems";
import clsx from "clsx";
import { useCollectionCategoriesContext } from "src/contexts/collections/collection-categories-context";

interface CollectionItemsProps {}

const CollectionItems: FC<CollectionItemsProps> = (props) => {
  const { tree } = useCollectionCategoriesContext();
  const { expandedIds, setExpandedIds, search } = useCollectionTreeContext();
  const router = useRouter();

  const items = useMemo(() => {
    return (tree?.collections || []).filter((item) =>
      item.name.toLowerCase().includes(search)
    );
  }, [search, tree?.collections]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
      router.replace({
        pathname: router.pathname,
        query: {
          ...router.query,
          searchType: "",
          collectionId: id == router.query.collectionId ? "" : id,
          sutraId: "",
          volumeId: "",
          orisonId: "",
        },
      });
      if (id != router.query.collectionId && expandedIds.includes(id)) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    [expandedIds, router]
  );

  return (
    <Accordion
      type="multiple"
      value={expandedIds}
      onValueChange={setExpandedIds}
      className="px-4"
    >
      {items.map((item) => (
        <AccordionItem key={item.id} value={item.id} className="border-b-0">
          <AccordionTrigger
            className={clsx(
              router.query.collectionId == item.id &&
                "font-semibold fill-primary"
            )}
            onClick={(e) => handleClick(e, item.id)}
          >
            {item.name}
          </AccordionTrigger>
          <AccordionContent>
            <SutraItems collectionId={item.id} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default CollectionItems;
