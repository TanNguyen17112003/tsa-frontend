import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useContext,
} from "react";
import { CollectionsApi } from "src/api/collections";
import useFunction, {
  DEFAULT_FUNCTION_RETURN,
  UseFunctionReturnType,
} from "src/hooks/use-function";
import { Collection, CollectionDetail } from "src/types/collection";
import { useCollectionCategoriesContext } from "./collection-categories-context";

interface ContextValue {
  getCollectionsApi: UseFunctionReturnType<FormData, CollectionDetail[]>;

  createCollection: (requests: Omit<CollectionDetail, "id">) => Promise<void>;
  updateCollection: (Collection: Partial<CollectionDetail>) => Promise<void>;
  deleteCollection: (ids: Collection["id"][]) => Promise<void>;
}

export const CollectionsContext = createContext<ContextValue>({
  getCollectionsApi: DEFAULT_FUNCTION_RETURN,

  createCollection: async () => {},
  updateCollection: async () => {},
  deleteCollection: async () => {},
});

const CollectionsProvider = ({ children }: { children: ReactNode }) => {
  const { updateTree } = useCollectionCategoriesContext();
  const getCollectionsApi = useFunction(CollectionsApi.getCollections);

  const createCollection = useCallback(
    async (request: Omit<CollectionDetail, "id">) => {
      try {
        const collection = await CollectionsApi.postCollection(request);
        if (collection) {
          const newCollections: CollectionDetail[] = [
            {
              ...request,
              id: collection.id,
            },
            ...(getCollectionsApi.data || []),
          ];
          getCollectionsApi.setData(newCollections);
          updateTree((tree) => ({
            ...tree,
            collections: [...tree.collections, collection],
          }));
        }
      } catch (error) {
        throw error;
      }
    },
    [getCollectionsApi, updateTree]
  );

  const updateCollection = useCallback(
    async (Collection: Partial<Collection>) => {
      try {
        await CollectionsApi.putCollections(Collection);
        getCollectionsApi.setData(
          (getCollectionsApi.data || []).map((c) =>
            c.id == Collection.id ? Object.assign(c, Collection) : c
          )
        );
        updateTree((tree) => ({
          ...tree,
          collections: tree.collections.map((c) =>
            c.id == Collection.id ? Object.assign(c, Collection) : c
          ),
        }));
      } catch (error) {
        throw error;
      }
    },
    [getCollectionsApi, updateTree]
  );

  const deleteCollection = useCallback(
    async (ids: Collection["id"][]) => {
      try {
        await CollectionsApi.deleteCollection(ids);
        getCollectionsApi.setData([
          ...(getCollectionsApi.data || []).filter(
            (collection) => !ids.includes(collection.id)
          ),
        ]);
        updateTree((tree) => ({
          ...tree,
          collections: tree.collections.filter(
            (collection) => !ids.includes(collection.id)
          ),
        }));
      } catch (error) {
        throw error;
      }
    },
    [getCollectionsApi, updateTree]
  );

  useEffect(() => {
    getCollectionsApi.call(new FormData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CollectionsContext.Provider
      value={{
        getCollectionsApi,

        createCollection,
        updateCollection,
        deleteCollection,
      }}
    >
      {children}
    </CollectionsContext.Provider>
  );
};

export const useCollectionsContext = () => useContext(CollectionsContext);

export default CollectionsProvider;
