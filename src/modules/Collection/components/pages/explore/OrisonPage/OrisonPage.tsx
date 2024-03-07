import { useCallback, type FC } from "react";
import CollectionBreadcrumb from "../../../CollectionBreadcrumb";
import clsx from "clsx";
import { useOrisonsContext } from "src/contexts/orisons/orisons-context";
import { Button } from "src/components/shadcn/ui/button";
import PlateEditor from "src/modules/Editor";
import Loading from "src/components/Loading";
import { Note } from "src/modules/Editor/types/note";
import { useRouter } from "next/router";

interface OrisonPageProps {}

const OrisonPage: FC<OrisonPageProps> = ({}) => {
  const { getOrisonsApi, orisonId, getOrisonDetailApi } = useOrisonsContext();
  const router = useRouter();

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
    <>
      <div className="flex justify-between p-5 border-b sticky top-0">
        <CollectionBreadcrumb />
        <div></div>
        <div
          className={clsx(
            "w-[220px] border overflow-y-auto pb-[60px] mt-4 mx-4 rounded-lg absolute left-0 top-full"
          )}
        >
          <div className="p-3 text-lg font-semibold text-text-secondary">
            Mục lục
          </div>
          <hr />
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
      </div>

      <div className="pl-[252px]">
        {getOrisonDetailApi.loading ? (
          <div className="flex h-[100px] items-center justify-center mt-4">
            <Loading />
          </div>
        ) : getOrisonDetailApi.data &&
          getOrisonDetailApi.data.id == orisonId ? (
          <PlateEditor
            initialValue={getOrisonDetailApi.data.content}
            notes={getOrisonDetailApi.data.notes}
            onUpdateNotes={() => {}}
            onChange={() => {}}
          />
        ) : null}
      </div>
    </>
  );
};

export default OrisonPage;
