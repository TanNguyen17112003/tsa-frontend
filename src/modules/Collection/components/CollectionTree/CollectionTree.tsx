import type { Dispatch, FC, SetStateAction } from "react";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { CollectionTreeResponse, CollectionsApi } from "src/api/collections";
import useFunction, {
  DEFAULT_FUNCTION_RETURN,
  UseFunctionReturnType,
} from "src/hooks/use-function";
import data from "./data";
import CollectionItems from "./CollectionItems";

interface ContextValue {
  getCollectionTreeApi: UseFunctionReturnType<FormData, CollectionTreeResponse>;
  expandedIds: string[];
  setExpandedIds: Dispatch<SetStateAction<string[] | undefined>>;
}

const storageKey = "collectionExpandedIds";

export const CollectionTreeContext = createContext<ContextValue>({
  getCollectionTreeApi: DEFAULT_FUNCTION_RETURN,
  expandedIds: [],
  setExpandedIds: () => {},
});

const CollectionTreeProvider = ({ children }: { children: ReactNode }) => {
  const getCollectionTreeApi = useFunction(CollectionsApi.getCollectionTree);
  const [expandedIds, setExpandedIds] = useState<string[]>();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      const data = raw ? JSON.parse(raw) : null;
      if (data && Array.isArray(data)) {
        setExpandedIds(data);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (expandedIds) {
      localStorage.setItem(storageKey, JSON.stringify(expandedIds));
    }
  }, [expandedIds]);

  useEffect(() => {
    getCollectionTreeApi.call({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CollectionTreeContext.Provider
      value={{
        getCollectionTreeApi,
        expandedIds: expandedIds || [],
        setExpandedIds,
      }}
    >
      {children}
    </CollectionTreeContext.Provider>
  );
};

export const useCollectionTreeContext = () => useContext(CollectionTreeContext);

interface CollectionTreeProps {}

const CollectionTree: FC<CollectionTreeProps> = ({}) => {
  return (
    <CollectionTreeProvider>
      <CollectionItems />
    </CollectionTreeProvider>
  );
};

export default CollectionTree;
