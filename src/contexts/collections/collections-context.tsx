
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
  const getCollectionsApi = useFunction(CollectionsApi.getCollections);

  const createCollection = useCallback(
    async (request: Omit<CollectionDetail, "id">) => {
      try {
        const id = await CollectionsApi.postCollection(request);
        if (id) {
          const newCollections: CollectionDetail[] = [
            {
              ...request,
              id: id,
            },
            ...(getCollectionsApi.data || []),
          ];
          getCollectionsApi.setData(newCollections);
        }
      } catch (error) {
        throw error;
      }
    },
    [getCollectionsApi]
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
      } catch (error) {
        throw error;
      }
    },
    [getCollectionsApi]
  );

  const deleteCollection = useCallback(
    async (ids: Collection["id"][]) => {
      try {
        const results = await Promise.allSettled(
          ids.map((id) => CollectionsApi.deleteCollection(id))
        );
        getCollectionsApi.setData([
          ...(getCollectionsApi.data || []).filter(
            (Collection) =>
              !results.find(
                (result, index) =>
                  result.status == "fulfilled" && ids[index] == Collection.id
              )
          ),
        ]);
        results.forEach((result, index) => {
          if (result.status == "rejected") {
            throw new Error(
              "Không thể xoá danh mục: " +
                ids[index] +
                ". " +
                result.reason.toString()
            );
          }
        });
      } catch (error) {
        throw error;
      }
    },
    [getCollectionsApi]
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
