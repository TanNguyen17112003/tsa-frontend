import type { Dispatch, FC, SetStateAction } from "react";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import CollectionItems from "./CollectionItems";

interface ContextValue {
  expandedIds: string[];
  setExpandedIds: Dispatch<SetStateAction<string[] | undefined>>;
}

const storageKey = "collectionExpandedIds";

export const CollectionTreeContext = createContext<ContextValue>({
  expandedIds: [],
  setExpandedIds: () => {},
});

const CollectionTreeProvider = ({ children }: { children: ReactNode }) => {
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

  return (
    <CollectionTreeContext.Provider
      value={{
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
