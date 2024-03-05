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
import OrisonPage from "./components/pages/explore/OrisonPage";
import VolumnExplorePage from "./components/pages/explore/VolumeExplorePage";
import SutraExplorePage from "./components/pages/explore/SutraExplorePage";
import OrisonExplorePage from "./components/pages/explore/OrisonExplorePage";

interface CollectionContentProps {
  sideNavClassName: string;
  className: string;
}

const CollectionContent: FC<CollectionContentProps> = ({
  sideNavClassName,
}) => {
  const { query } = useRouter();

  console.log("query", query);

  return (
    <>
      <div
        className={clsx(
          "w-[300px] border-r h-full overflow-y-auto pb-[160px]",
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
      {query.searchType == "text" ? (
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
      ) : query.orisonId ? (
        <OrisonPage />
      ) : query.volumeId ? (
        <OrisonExplorePage />
      ) : query.sutraId ? (
        <VolumnExplorePage />
      ) : query.collectionId ? (
        <SutraExplorePage />
      ) : !query.collectionId ? (
        <CollectionExplorePage />
      ) : (
        <> not found</>
      )}
    </>
  );
};

export default CollectionContent;
