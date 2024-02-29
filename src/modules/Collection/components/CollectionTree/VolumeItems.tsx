import { useRouter } from "next/router";
import { useMemo, type FC, useCallback } from "react";
import { BsFileText } from "react-icons/bs";
import { Button } from "src/components/shadcn/ui/button";
import { useCollectionTreeContext } from "./CollectionTree";
import { Accordion } from "./CollectionTreeAccordion";
import clsx from "clsx";

interface VolumeItemsProps {
  sutraId: string;
}

const VolumeItems: FC<VolumeItemsProps> = (props) => {
  const { expandedIds, getCollectionTreeApi } = useCollectionTreeContext();
  const router = useRouter();

  const items = useMemo(() => {
    return (
      getCollectionTreeApi.data?.volumes.filter(
        (volume) => volume.sutras_id == props.sutraId
      ) || []
    );
  }, [getCollectionTreeApi.data?.volumes, props.sutraId]);

  const handleClick = useCallback(
    (id: string) => {
      const volume = getCollectionTreeApi.data?.volumes.find(
        (volume) => volume.id == id
      );
      const sutra = getCollectionTreeApi.data?.sutras?.find(
        (sutra) => sutra.id == volume?.sutras_id
      );
      const collection = getCollectionTreeApi.data?.collections?.find(
        (collection) => collection.id == sutra?.collection_id
      );
      router.replace({
        pathname: router.pathname,
        query: {
          ...router.query,
          searchType: "",
          collectionId: collection?.id || "",
          sutraId: sutra?.id || "",
          volumeId: id == router.query.volumeId ? "" : id,
          orisonId: "",
        },
      });
    },
    [
      getCollectionTreeApi.data?.collections,
      getCollectionTreeApi.data?.sutras,
      getCollectionTreeApi.data?.volumes,
      router,
    ]
  );

  return (
    <Accordion type="multiple" className="w-full pl-4" value={expandedIds}>
      <div className="flex flex-col justify-start items-start">
        {items.map((item) => (
          <Button
            key={item.id}
            value={item.id}
            className={clsx(
              "border-b-0 py-0 gap-2 hover:text-gray hover:bg-white hover:underline",
              router.query.volumeId == item.id && "text-semibold"
            )}
            variant="ghost"
            onClick={() => handleClick(item.id)}
          >
            <BsFileText
              className={clsx(
                "h-6 w-6",
                router.query.volumeId == item.id
                  ? "fill-secondary"
                  : "fill-gray-400"
              )}
            />
            {item.name}
          </Button>
        ))}
      </div>
    </Accordion>
  );
};

export default VolumeItems;
