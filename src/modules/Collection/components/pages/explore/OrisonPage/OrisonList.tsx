import clsx from "clsx";
import { useRouter } from "next/router";
import { useCallback, type FC } from "react";
import { Button } from "src/components/shadcn/ui/button";
import { useOrisonsContext } from "src/contexts/orisons/orisons-context";

interface OrisonListProps {
  className?: string;
}

const OrisonList: FC<OrisonListProps> = ({ className }) => {
  const router = useRouter();

  const { getOrisonsApi, orisonId } = useOrisonsContext();
  const handleChangeOrison = useCallback(
    (id: string) => {
      router.replace({
        pathname: router.pathname,
        query: { ...router.query, orisonId: id },
      });
    },
    [router]
  );

  return (
    <div
      className={clsx("border rounded-lg pb-[40px] overflow-y-auto", className)}
    >
      <div className="sticky top-0 bg-white">
        <div className="p-3 text-lg font-semibold text-text-secondary ">
          Mục lục
        </div>
        <hr />
      </div>
      <div className="flex flex-col gap-1 pt-4 px-2">
        {getOrisonsApi.data?.map((orison) => (
          <Button
            key={orison.id}
            variant="ghost"
            className={clsx(
              "w-full justify-start text-primary",
              orison.id == orisonId && "bg-accent"
            )}
            onClick={() => handleChangeOrison(orison.id)}
          >
            {orison.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default OrisonList;
