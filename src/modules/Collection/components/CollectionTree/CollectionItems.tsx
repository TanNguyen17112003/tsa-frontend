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

interface CollectionItemsProps {}

const CollectionItems: FC<CollectionItemsProps> = (props) => {
  const { expandedIds, setExpandedIds, getCollectionTreeApi } =
    useCollectionTreeContext();
  const router = useRouter();

  const items = useMemo(() => {
    return getCollectionTreeApi.data?.collections || [];
  }, [getCollectionTreeApi.data?.collections]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
      router.replace({
        pathname: router.pathname,
        query: {
          ...router.query,
          collection_id: id == router.query.collection_id ? "" : id,
          sutra_id: "",
          volume_id: "",
          orison_id: "",
        },
      });
      if (id != router.query.collection_id && expandedIds.includes(id)) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    [expandedIds, router]
  );

  console.log("expandedIds", expandedIds);

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
              router.query.collection_id == item.id &&
                "font-semibold fill-primary"
            )}
            onClick={(e) => handleClick(e, item.id)}
          >
            {item.name}
          </AccordionTrigger>
          <AccordionContent>
            <SutraItems collection_id={item.id} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default CollectionItems;
