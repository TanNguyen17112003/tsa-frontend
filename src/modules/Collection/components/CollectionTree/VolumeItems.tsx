import { useRouter } from "next/router";
import { useMemo, type FC, useCallback } from "react";
import { BsFileText } from "react-icons/bs";
import { Button } from "src/components/shadcn/ui/button";
import { useCollectionTreeContext } from "./CollectionTree";
import { Accordion } from "./CollectionTreeAccordion";
import clsx from "clsx";

interface VolumeItemsProps {
  sutra_id: string;
}

const VolumeItems: FC<VolumeItemsProps> = (props) => {
  const { expandedIds, getCollectionTreeApi } = useCollectionTreeContext();
  const router = useRouter();

  const items = useMemo(() => {
    return (
      getCollectionTreeApi.data?.volumes.filter(
        (volume) => volume.sutra_id == props.sutra_id
      ) || []
    );
  }, [getCollectionTreeApi.data?.volumes, props.sutra_id]);

  const handleClick = useCallback(
    (id: string) => {
      router.replace({
        pathname: router.pathname,
        query: {
          ...router.query,
          volume_id: id == router.query.volume_id ? "" : id,
          orison_id: "",
        },
      });
    },
    [router]
  );

  return (
    <Accordion type="multiple" className="w-full pl-4" value={expandedIds}>
      {items.map((item) => (
        <Button
          key={item.id}
          value={item.id}
          className={clsx(
            "border-b-0 py-0 gap-2 hover:text-gray hover:bg-white hover:underline",
            router.query.volume_id == item.id && "text-semibold"
          )}
          variant="ghost"
          onClick={() => handleClick(item.id)}
        >
          <BsFileText
            className={clsx(
              "h-6 w-6",
              router.query.volume_id == item.id
                ? "fill-secondary"
                : "fill-gray-400"
            )}
          />
          {item.name}
        </Button>
      ))}
    </Accordion>
  );
};

export default VolumeItems;
