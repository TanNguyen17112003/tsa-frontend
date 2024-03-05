import type { Dispatch, FC, SetStateAction } from "react";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import CollectionItems from "./CollectionItems";
import SearchInput from "./SearchInput";

interface ContextValue {
  expandedIds: string[];
  setExpandedIds: Dispatch<SetStateAction<string[] | undefined>>;
  search: string;
  setSearch: (value: string) => void;
}

const storageKey = "collectionExpandedIds";

export const CollectionTreeContext = createContext<ContextValue>({
  expandedIds: [],
  setExpandedIds: () => {},
  search: "",
  setSearch: () => {},
});

const CollectionTreeProvider = ({ children }: { children: ReactNode }) => {
  const [expandedIds, setExpandedIds] = useState<string[]>();
  const [search, setSearch] = useState("");

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
        search,
        setSearch,
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
      <SearchInput />
      <CollectionItems />
    </CollectionTreeProvider>
  );
};

export default CollectionTree;
