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
  const { tree, goCollection } = useCollectionCategoriesContext();
  const { expandedIds, setExpandedIds, search } = useCollectionTreeContext();
  const router = useRouter();

  const viewType = (router.query.viewType || "all").toString();

  const items = useMemo(() => {
    return (tree?.collections || []).filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, tree?.collections]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
      goCollection(id);
      if (id != router.query.collectionId && expandedIds.includes(id)) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    [expandedIds, goCollection, router.query.collectionId]
  );

  if (viewType != "all" && viewType != "collection") {
    return (
      <>
        {items.map((item) => (
          <SutraItems key={item.id} collectionId={item.id} />
        ))}
      </>
    );
  }

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
          {viewType != "collection" && (
            <AccordionContent>
              <SutraItems collectionId={item.id} />
            </AccordionContent>
          )}
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default CollectionItems;
