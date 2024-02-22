import { useRouter } from "next/router";
import type { FC } from "react";
import SearchNavigator from "./components/SearchNavigator";
import ViewNavigator from "./components/ViewNavigator";
import AuthorSearchPage from "./pages/search/AuthorSearchPage";
import CircaSearchPage from "./pages/search/CircaSearchPage";
import SutraSearchPage from "./pages/search/SutraSearchPage";
import TextSearchPage from "./pages/search/TextSearchPage";
import CollectionPage from "./pages/view/CollectionPage";

interface CollectionProps {}

const Collection: FC<CollectionProps> = ({}) => {
  const { query } = useRouter();

  return (
    <div className="flex">
      <div className="w-[300px] border">
        <div className="sticky top-0 p-3">
          <SearchNavigator />
        </div>
        <hr />
        <div className="p-4">
          <ViewNavigator />
        </div>
      </div>
      <div className="flex-1">
        {!query.searchType && !query.collectionId ? (
          <CollectionPage />
        ) : query.searchType == "text" ? (
          <TextSearchPage />
        ) : query.searchType == "sutra" ? (
          <SutraSearchPage />
        ) : query.searchType == "author" ? (
          <AuthorSearchPage />
        ) : query.searchType == "circa" ? (
          <CircaSearchPage />
        ) : (
          <div>Not found</div>
        )}
      </div>
    </div>
  );
};

export default Collection;
