import { useRouter } from "next/router";
import type { FC } from "react";
import clsx from "clsx";
import CollectionTree from "./components/CollectionTree";
import SearchNavigator from "./components/SearchNavigator";
import ViewNavigator from "./components/ViewNavigator";
import ButtonNavigate from "./components/ButtonNavigte/ButtonNavigate";
import AuthorSearchPage from "./components/pages/search/AuthorSearchPage/AuthorSearchPage";
import CircaSearchPage from "./components/pages/search/CircaSearchPage/CircaSearchPage";
import SutraSearchPage from "./components/pages/search/SutraSearchPage/SutraSearchPage";
import TextSearchPage from "./components/pages/search/TextSearchPage/TextSearchPage";
import BasicSearchPage from "./components/pages/search/BasicSearchPage";
import AdvanceSearchPage from "./components/pages/search/AdvanceSearchPage";
import AdjacentSearchPage from "./components/pages/search/AdjacentSearchPage";
import CollectionExplorePage from "./components/pages/explore/CollectionExplorePage";
import OrisonPage from "./components/pages/explore/OrisonPage";
import VolumnExplorePage from "./components/pages/explore/VolumeExplorePage";
import SutraExplorePage from "./components/pages/explore/SutraExplorePage";
import OrisonExplorePage from "./components/pages/explore/OrisonExplorePage";
import AuthorSearchResultPage from "./components/pages/search/AuthorTranslatorSearchResultPage/AuthorSearchResultPage";
import CircaSearchResultPage from "./components/pages/search/CircaSearchResultPage/CircaSearchResultPage";
import TranslatorSearchResultPage from "./components/pages/search/AuthorTranslatorSearchResultPage/TranslatorSearchResultPage";
import SearchResultPage from "./components/pages/search/SearchResultPage/SearchResultPage";
import VolumeOriginalPage from "./components/pages/explore/VolumeOriginalPage";

interface CollectionContentProps {}

const CollectionContent: FC<CollectionContentProps> = ({}) => {
  const { query } = useRouter();
  const isFullScreen = query.isFullScreen == "true";

  return (
    <>
      <div
        className={clsx(
          "w-[300px] border-r h-full overflow-y-auto pb-[80px] sticky top-0 mb-[-100%] translate-x-[-300px]"
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
      <div
        className={clsx(
          "absolute top-0 h-full flex flex-col overflow-y-auto",
          isFullScreen ? "w-full left-0" : "w-[calc(100%_-_300px)]"
        )}
      >
        <div>
          <ButtonNavigate isHidden={true} />
        </div>
        {query.qCircaFrom && query.qCircaTo ? (
          <CircaSearchResultPage
            qCircaFrom={query.qCircaFrom.toString()}
            qCircaTo={query.qCircaTo.toString()}
          />
        ) : query.searchType == "text" ? (
          <TextSearchPage />
        ) : query.authorId ? (
          <AuthorSearchResultPage qAuthorId={query.authorId.toString()} />
        ) : query.translatorId ? (
          <TranslatorSearchResultPage
            qTranslatorId={query.translatorId.toString()}
          />
        ) : query.searchType == "sutra" ? (
          <SutraSearchPage />
        ) : query.searchType == "author" ? (
          <AuthorSearchPage />
        ) : query.searchType == "circa" ? (
          <CircaSearchPage />
        ) : query.searchType == "basic" && query.orisonId ? (
          <SearchResultPage />
        ) : query.searchType == "basic" ? (
          <BasicSearchPage />
        ) : query.searchType == "advance" && query.orisonId ? (
          <SearchResultPage />
        ) : query.searchType == "advance" ? (
          <AdvanceSearchPage />
        ) : query.searchType == "adjacent" && query.orisonId ? (
          <SearchResultPage />
        ) : query.searchType == "adjacent" ? (
          <AdjacentSearchPage />
        ) : query.orisonId && query.viewOriginalDoc !== "true" ? (
          <OrisonPage />
        ) : query.volumeId && query.viewOriginalDoc == "true" ? (
          <VolumeOriginalPage />
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
      </div>
      
    </>
  );
};

export default CollectionContent;
