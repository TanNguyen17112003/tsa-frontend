import { useRouter } from "next/router";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { CollectionsApi } from "src/api/collections";
import Loading from "src/components/Loading";
import useFunction from "src/hooks/use-function";
import { paths } from "src/paths";
import { Orison, initialOrison } from "src/types/orison";

interface ContextValue {
  orison: Orison[];
  goOrison: (id: string) => void;
}

export const DiaryOrisonsContext = createContext<ContextValue>({
  orison: [initialOrison],
  goOrison: () => {},
});

const DiaryOrisonsProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const getCollectionTreeApi = useFunction(CollectionsApi.getCollectionTree);

  const goOrison = useCallback(
    (id: string) => {
      const tree = getCollectionTreeApi.data;
      const orison = tree?.orisons.find((orison) => orison.id == id);
      const volume = tree?.volumes.find(
        (volume) => volume.id == orison?.volume_id
      );
      const sutra = tree?.sutras?.find(
        (sutra) => sutra.id == volume?.sutras_id
      );
      const collection = tree?.collections?.find(
        (collection) => collection.id == sutra?.collection_id
      );
      router.replace({
        pathname: paths.dashboard.collections,
        query: {
          ...router.query,
          searchType: "",
          collectionId: collection?.id || "",
          sutraId: sutra?.id || "",
          volumeId: volume?.id || "",
          orisonId: orison?.id || "",
        },
      });
    },
    [getCollectionTreeApi.data, router]
  );

  useEffect(() => {
    getCollectionTreeApi.call({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!getCollectionTreeApi.data) {
    return (
      <div className="h-[200px] flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <DiaryOrisonsContext.Provider
      value={{
        orison: getCollectionTreeApi.data.orisons || initialOrison,
        goOrison,
      }}
    >
      {children}
    </DiaryOrisonsContext.Provider>
  );
};

export const useDiaryOrisonsContext = () => useContext(DiaryOrisonsContext);

export default DiaryOrisonsProvider;
