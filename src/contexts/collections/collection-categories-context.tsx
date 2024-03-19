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
} from "src/api/collections";
import Loading from "src/components/Loading";
import useFunction from "src/hooks/use-function";
import { CollectionDetail, enrichCollection } from "src/types/collection";

interface ContextValue extends CollectionCategoriesResponse {
  tree?: CollectionTreeResponse;
  updateTree: (
    callback: (prev: CollectionTreeResponse) => CollectionTreeResponse
  ) => void;
  goCollection: (id: string) => void;
  goSutra: (id: string) => void;
  goVolume: (id: string) => void;
  goOrison: (id: string) => void;

  getCollections: () => CollectionDetail[];
}

export const CollectionCategoriesContext = createContext<ContextValue>({
  authors: [],
  format_sutras: [],
  format_words: [],
  format_pages: [],
  circas: [],
  translators: [],
  updateTree: () => {},
  goCollection: () => {},
  goSutra: () => {},
  goVolume: () => {},
  goOrison: () => {},

  getCollections: () => [],
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

  const getCollections = useCallback(() => {
    const tree = getCollectionTreeApi.data;
    if (!tree) {
      return [];
    }
    return tree.collections.map((c) =>
      enrichCollection(
        c,
        tree,
        getCategoriesApi.data || initialCollectionCategories
      )
    );
  }, [getCategoriesApi.data, getCollectionTreeApi.data]);

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
    (id: string) => {
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
        updateTree,
        ...getCategoriesApi.data,
        tree: getCollectionTreeApi.data,
        goCollection,
        goSutra,
        goVolume,
        goOrison,

        getCollections,
      }}
    >
      {children}
    </CollectionCategoriesContext.Provider>
  );
};

export const useCollectionCategoriesContext = () =>
  useContext(CollectionCategoriesContext);

export default CollectionCategoriesProvider;
