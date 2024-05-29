import { useMemo, type FC, useCallback } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./CollectionTreeAccordion";
import { useCollectionTreeContext } from "./CollectionTree";
import VolumeItems from "./VolumeItems";
import { useRouter } from "next/router";
import clsx from "clsx";
import { useCollectionCategoriesContext } from "src/contexts/collections/collection-categories-context";

interface SutraItemsProps {
  collectionId: string;
}

const SutraItems: FC<SutraItemsProps> = (props) => {
  const { tree, goSutra } = useCollectionCategoriesContext();
  const { expandedIds, setExpandedIds, search } = useCollectionTreeContext();
  const router = useRouter();

  const viewType = (router.query.viewType || "all").toString();

  const items = useMemo(() => {
    return (
      tree?.sutras.filter(
        (sutra) =>
          sutra.collection_id == props.collectionId &&
          sutra.name.toLowerCase().includes(search.toLowerCase())
      ) || []
    );
  }, [tree?.sutras, props.collectionId, search]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
      goSutra(id);
      if (id != router.query.sutraId && expandedIds.includes(id)) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    [goSutra, router.query.sutraId, expandedIds]
  );

  if (viewType != "all" && viewType != "sutra") {
    return (
      <>
        {items.map((item) => (
          <VolumeItems key={item.id} sutraId={item.id} />
        ))}
      </>
    );
  }

  return (
    <Accordion
      type="multiple"
      className="w-full pl-4"
      value={expandedIds}
      onValueChange={setExpandedIds}
    >
      {items.map((item) => (
        <AccordionItem key={item.id} value={item.id} className="border-b-0">
          <AccordionTrigger
            className={clsx(
              router.query.sutraId == item.id && "font-semibold fill-primary"
            )}
            onClick={(e) => handleClick(e, item.id)}
          >
            {item.name}
          </AccordionTrigger>
          {viewType != "sutra" && (
            <AccordionContent>
              <VolumeItems sutraId={item.id} />
            </AccordionContent>
          )}
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default SutraItems;
