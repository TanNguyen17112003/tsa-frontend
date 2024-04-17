import { useRouter } from "next/router";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
} from "react";
import {
  CollectionCategoriesResponse,
  CollectionTreeResponse,
  CollectionsApi,
  initialCollectionCategories,
  initialCollectionTree,
} from "src/api/collections";
import Loading from "src/components/Loading";
import useFunction from "src/hooks/use-function";
import { CollectionDetail } from "src/types/collection";

interface ContextValue {
  tree: CollectionTreeResponse;
  categories: CollectionCategoriesResponse;
  updateTree: (
    callback: (prev: CollectionTreeResponse) => CollectionTreeResponse
  ) => void;
  goCollection: (id: string) => void;
  goSutra: (id: string) => void;
  goVolume: (
    id: string,
    viewOriginalDoc?: {
      page: number;
    }
  ) => void;
  goOrison: (id: string) => void;
}

export const CollectionCategoriesContext = createContext<ContextValue>({
  tree: initialCollectionTree,
  categories: initialCollectionCategories,
  updateTree: () => {},
  goCollection: () => {},
  goSutra: () => {},
  goVolume: () => {},
  goOrison: () => {},
});

const CollectionCategoriesProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const router = useRouter();
  const getCollectionTreeApi = useFunction(CollectionsApi.getCollectionTree);
  const getCategoriesApi = useFunction(CollectionsApi.getCollectionCategories);

  const updateTree = useCallback(
    (callback: (prev: CollectionTreeResponse) => CollectionTreeResponse) => {
      if (getCollectionTreeApi.data) {
        const newTree = callback(getCollectionTreeApi.data);
        getCollectionTreeApi.setData(newTree);
      }
    },
    [getCollectionTreeApi]
  );

  const goCollection = useCallback(
    (id: string) => {
      router.replace({
        pathname: router.pathname,
        query: {
          ...router.query,
          searchType: "",
          collectionId: id,
          sutraId: "",
          volumeId: "",
          orisonId: "",
        },
      });
    },
    [router]
  );

  const goSutra = useCallback(
    (id: string) => {
      const tree = getCollectionTreeApi.data;
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
          sutraId: sutra?.id || "",
          volumeId: "",
          orisonId: "",
        },
      });
    },
    [getCollectionTreeApi.data, router]
  );

  const goVolume = useCallback(
    (
      id: string,
      viewOriginalDoc?: {
        page: number;
      }
    ) => {
      const tree = getCollectionTreeApi.data;
      const volume = tree?.volumes.find((volume) => volume.id == id);
      const sutra = tree?.sutras?.find(
        (sutra) => sutra.id == volume?.sutras_id
      );
      const collection = tree?.collections?.find(
        (collection) => collection.id == sutra?.collection_id
      );
      router.replace({
        pathname: router.pathname,
        query: {
          ...router.query,
          searchType: "",
          collectionId: collection?.id || "",
          sutraId: sutra?.id || "",
          volumeId: volume?.id || "",
          orisonId: "",
          ...(viewOriginalDoc
            ? { viewOriginalDoc: true, page: viewOriginalDoc.page }
            : { viewOriginalDoc: false }),
        },
      });
    },
    [getCollectionTreeApi.data, router]
  );

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
        pathname: router.pathname,
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
    getCategoriesApi.call({});
    getCollectionTreeApi.call({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!getCategoriesApi.data || !getCollectionTreeApi.data) {
    return (
      <div className="h-[200px] flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <CollectionCategoriesContext.Provider
      value={{
        tree: getCollectionTreeApi.data || initialCollectionTree,
        categories: getCategoriesApi.data || initialCollectionCategories,
        updateTree,
        goCollection,
        goSutra,
        goVolume,
        goOrison,
      }}
    >
      {children}
    </CollectionCategoriesContext.Provider>
  );
};

export const useCollectionCategoriesContext = () =>
  useContext(CollectionCategoriesContext);

export default CollectionCategoriesProvider;
