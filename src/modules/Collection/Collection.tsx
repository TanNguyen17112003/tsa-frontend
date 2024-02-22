import { useRouter } from "next/router";
import type { FC } from "react";
import SearchNavigator from "./components/SearchNavigator";
import ViewNavigator from "./components/ViewNavigator";
import AuthorSearchPage from "./components/pages/search/AuthorSearchPage/AuthorSearchPage";
import CircaSearchPage from "./components/pages/search/CircaSearchPage";
import SutraSearchPage from "./components/pages/search/SutraSearchPage/SutraSearchPage";
import TextSearchPage from "./components/pages/search/TextSearchPage/TextSearchPage";
import CollectionPage from "./components/pages/view/CollectionPage";
import BasicSearchPage from "./components/pages/search/BasicSearchPage";
import AdvanceSearchPage from "./components/pages/search/AdvanceSearchPage";
import AdjacentSearchPage from "./components/pages/search/AdjacentSearchPage";

interface CollectionProps {}

const Collection: FC<CollectionProps> = ({}) => {
  const { query } = useRouter();

  return (
    <div className="flex">
      <div className="w-[300px] border-r">
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
        ) : query.searchType == "basic" ? (
          <BasicSearchPage />
        ) : query.searchType == "advance" ? (
          <AdvanceSearchPage />
        ) : query.searchType == "adjacent" ? (
          <AdjacentSearchPage />
        ) : (
          <div>Not found</div>
        )}
      </div>
    </div>
  );
};

export default Collection;
