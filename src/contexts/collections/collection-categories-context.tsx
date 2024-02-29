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
} from "src/api/collections";
import Loading from "src/components/Loading";
import useFunction from "src/hooks/use-function";

interface ContextValue extends CollectionCategoriesResponse {
  tree?: CollectionTreeResponse;
  updateTree: (
    callback: (prev: CollectionTreeResponse) => CollectionTreeResponse
  ) => void;
}

export const CollectionCategoriesContext = createContext<ContextValue>({
  authors: [],
  format_sutras: [],
  format_words: [],
  format_pages: [],
  circas: [],
  translators: [],
  updateTree: () => {},
});

const CollectionCategoriesProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
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
      }}
    >
      {children}
    </CollectionCategoriesContext.Provider>
  );
};

export const useCollectionCategoriesContext = () =>
  useContext(CollectionCategoriesContext);

export default CollectionCategoriesProvider;
