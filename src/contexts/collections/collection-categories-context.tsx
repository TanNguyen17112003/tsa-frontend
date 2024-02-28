import { ReactNode, createContext, useContext, useEffect } from "react";
import {
  CollectionCategoriesResponse,
  CollectionsApi,
} from "src/api/collections";
import Loading from "src/components/Loading";
import useFunction from "src/hooks/use-function";

interface ContextValue extends CollectionCategoriesResponse {}

export const CollectionCategoriesContext = createContext<ContextValue>({
  authors: [],
  format_sutras: [],
  format_words: [],
  format_pages: [],
  circas: [],
});

const CollectionCategoriesProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const getCategoriesApi = useFunction(CollectionsApi.getCollectionCategories);

  useEffect(() => {
    getCategoriesApi.call({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!getCategoriesApi.data) {
    return (
      <div className="h-[200px] flex items-center justify-center">
        <Loading size="h-[100px] w-[100px]" />
      </div>
    );
  }

  return (
    <CollectionCategoriesContext.Provider
      value={{
        ...getCategoriesApi.data,
      }}
    >
      {children}
    </CollectionCategoriesContext.Provider>
  );
};

export const useCollectionCategoriesContext = () =>
  useContext(CollectionCategoriesContext);

export default CollectionCategoriesProvider;
