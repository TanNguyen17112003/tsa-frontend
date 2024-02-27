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

interface SutraItemsProps {
  collection_id: string;
}

const SutraItems: FC<SutraItemsProps> = (props) => {
  const { expandedIds, setExpandedIds, getCollectionTreeApi } =
    useCollectionTreeContext();
  const router = useRouter();

  const items = useMemo(() => {
    return (
      getCollectionTreeApi.data?.sutras.filter(
        (sutra) => sutra.collection_id == props.collection_id
      ) || []
    );
  }, [getCollectionTreeApi.data?.sutras, props.collection_id]);

  const handleClick = useCallback(
    (id: string) => {
      router.replace({
        pathname: router.pathname,
        query: {
          ...router.query,
          sutra_id: id == router.query.sutra_id ? "" : id,
          volume_id: "",
          orison_id: "",
        },
      });
    },
    [router]
  );

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
              router.query.collection_id == item.id &&
                "font-semibold fill-primary"
            )}
            onClick={() => handleClick(item.id)}
          >
            {item.name}
          </AccordionTrigger>
          <AccordionContent>
            <VolumeItems sutra_id={item.id} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default SutraItems;
