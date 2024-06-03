import { RectangleStackIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import { useMemo, type FC, ReactNode } from "react";
import searchTypes from "../../constants/searchTypes";
import { BsChevronCompactRight } from "react-icons/bs";
import { Button } from "src/components/shadcn/ui/button";
import { useCollectionCategoriesContext } from "src/contexts/collections/collection-categories-context";

interface CollectionBreadcrumbProps {}

const CollectionBreadcrumb: FC<CollectionBreadcrumbProps> = ({}) => {
  const { tree, categories, goCollection, goSutra, goVolume, goOrison } =
    useCollectionCategoriesContext();

  const router = useRouter();

  const items = useMemo(() => {
    const bItems: { icon?: ReactNode; label: string; onClick?: () => void }[] =
      [];
    bItems.push({
      label: "Kho dữ liệu",
      onClick: () => router.replace({ pathname: router.pathname, query: {} }),
    });
    const searchType = searchTypes.find(
      (st) => st.value == router.query.searchType
    );
    if (searchType) {
      const newQuery: any = {};
      Object.keys(router.query).forEach((key) =>
        key.startsWith("q") ? null : (newQuery[key] = router.query[key])
      );
      bItems.push({
        label: searchType.label,
        onClick: () =>
          router.replace({ pathname: router.pathname, query: newQuery }),
      });
      if (router.query.translatorId) {
        const translator = categories.translators.find(
          (item) => item.id == router.query.translatorId
        )?.full_name;
        bItems.push({
          label: `Kết quả tìm kiếm dịch giả "${translator || ""}"`,
        });
      }
      if (router.query.authorId) {
        const author = categories.authors.find(
          (item) => item.id == router.query.authorId
        )?.author;
        bItems.push({
          label: `Kết quả tìm kiếm tác giả "${author || ""}"`,
        });
      }
      if (searchType.value == "basic" && router.query.orisonId) {
        const textSearch = router.query.textSearch;
        bItems.push({
          label: `Kết quả "${textSearch}"`,
        });
      }
      if (searchType.value == "advance" && router.query.orisonId) {
        const orisonName = tree.orisons.find(
          (item) => item.id == router.query.orisonId
        )?.name;
        bItems.push({
          label: `Kết quả "${orisonName}"`,
        });
      }
      if (searchType.value == "adjacent" && router.query.orisonId) {
        const orison = tree.orisons.find(
          (item) => item.id == router.query.orisonId
        )?.name;
        bItems.push({
          label: `Kết quả "${orison}"`,
        });
      }
      if (router.query.qCircaFrom && router.query.qCircaTo) {
        bItems.push({
          label: `Kết quả tìm kiếm "${router.query.qCircaFrom} TCN - ${router.query.qCircaTo} TCN"`,
        });
      }
      if (router.query.resultLabel) {
        bItems.push({
          label: `Kết quả tìm kiếm ${
            searchType.value == "author"
              ? "tác giả"
              : searchType.value == "circa"
              ? "niên đại"
              : ""
          } "${router.query.resultLabel}"`,
        });
      }
    } else {
      const collection = tree?.collections.find(
        (c) => c.id == router.query.collectionId
      );
      if (collection) {
        bItems.push({
          label: collection.name,
          onClick: () => goCollection(collection.id),
        });
      }
      const sutra = tree?.sutras.find((c) => c.id == router.query.sutraId);
      if (sutra) {
        bItems.push({
          label: sutra.name,
          onClick: () => goSutra(sutra.id),
        });
      }
      const volume = tree?.volumes.find((c) => c.id == router.query.volumeId);
      if (volume) {
        bItems.push({
          label: volume.name,
          onClick: () => goVolume(volume.id),
        });
      }
      if (router.query.viewOriginalDoc == "true") {
        bItems.push({ label: "Xem văn bản gốc" });
      } else {
        const orison = tree?.orisons.find((c) => c.id == router.query.orisonId);
        if (orison) {
          bItems.push({
            label: orison.name,
            onClick: () => goOrison(orison.id),
          });
        }
      }
    }
    return bItems;
  }, [
    categories.authors,
    categories.translators,
    goCollection,
    goOrison,
    goSutra,
    goVolume,
    router,
    tree?.collections,
    tree?.orisons,
    tree?.sutras,
    tree?.volumes,
  ]);

  return (
    <div className="flex gap-2 flex-wrap items-center">
      <RectangleStackIcon className="w-4 h-4 fill-text-tetiary" />
      {items.map((item, index) => (
        <div className="flex gap-2 items-center" key={item.label}>
          {index > 0 && <BsChevronCompactRight className="w-4 h-4" />}
          {index < items.length - 1 ? (
            <Button variant="ghost" size="sm" onClick={item.onClick}>
              <div className="text-sm font-medium">{item.label}</div>

            </Button>
          ) : (
            <div className="text-sm text-primary px-2">{item.label}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CollectionBreadcrumb;
