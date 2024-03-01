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
  const { tree } = useCollectionCategoriesContext();
  const { expandedIds, setExpandedIds } = useCollectionTreeContext();
  const router = useRouter();

  const viewType = router.query.viewType;

  const items = useMemo(() => {
    return (
      tree?.sutras.filter(
        (sutra) => sutra.collection_id == props.collectionId
      ) || []
    );
  }, [tree?.sutras, props.collectionId]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
      const sutra = tree?.sutras?.find((sutra) => sutra.id == id);
      const collection = tree?.collections?.find(
        (collection) => collection.id == sutra?.collection_id
      );
      router.replace({
        pathname: router.pathname,
        query: {
          ...router.query,
          searchType: "",
          collectionId: collection?.id || "",
          sutraId: id == router.query.sutraId ? "" : id,
          volumeId: "",
          orisonId: "",
        },
      });
      if (id != router.query.sutraId && expandedIds.includes(id)) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    [expandedIds, tree?.collections, tree?.sutras, router]
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
