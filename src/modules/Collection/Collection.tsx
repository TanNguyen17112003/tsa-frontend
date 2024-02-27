import { useRouter } from "next/router";
import type { FC } from "react";
import SearchNavigator from "./components/SearchNavigator";
import ViewNavigator from "./components/ViewNavigator";
import AuthorSearchPage from "./components/pages/search/AuthorSearchPage/AuthorSearchPage";
import CircaSearchPage from "./components/pages/search/CircaSearchPage/CircaSearchPage";
import SutraSearchPage from "./components/pages/search/SutraSearchPage/SutraSearchPage";
import TextSearchPage from "./components/pages/search/TextSearchPage/TextSearchPage";
import BasicSearchPage from "./components/pages/search/BasicSearchPage";
import AdvanceSearchPage from "./components/pages/search/AdvanceSearchPage";
import AdjacentSearchPage from "./components/pages/search/AdjacentSearchPage";
import CollectionExplorePage from "./components/pages/explore/CollectionExplorePage";
import clsx from "clsx";
import CollectionTree from "./components/CollectionTree";

interface CollectionProps {
  sideNavClassName: string;
  className: string;
}

const Collection: FC<CollectionProps> = ({ sideNavClassName }) => {
  const { query } = useRouter();

  return (
    <>
      <div
        className={clsx(
          "w-[300px] border-r h-full overflow-y-auto",
          sideNavClassName
        )}
      >
        <div className="p-3">
          <SearchNavigator />
        </div>
        <hr />
        <div className="p-4">
          <ViewNavigator />
        </div>
        <CollectionTree />
      </div>
      <div className="pl-[300px] relative">
        {!query.searchType && !query.collectionId ? (
          <CollectionExplorePage />
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
        ) : !query.collectionId ? (
          <CollectionExplorePage />
        ) : (
          <div>Not found</div>
        )}
      </div>
    </>
  );
};

export default Collection;
