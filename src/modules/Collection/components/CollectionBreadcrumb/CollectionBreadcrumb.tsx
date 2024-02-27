import { RectangleStackIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import { useMemo, type FC, ReactNode } from "react";
import searchTypes from "../../constants/searchTypes";
import { BsChevronCompactRight } from "react-icons/bs";
import { Button } from "src/components/shadcn/ui/button";

interface CollectionBreadcrumbProps {}

const CollectionBreadcrumb: FC<CollectionBreadcrumbProps> = ({}) => {
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
    }
    return bItems;
  }, [router]);

  return (
    <div className="flex gap-2 flex-wrap items-center">
      <RectangleStackIcon className="w-4 h-4 fill-text-tetiary" />
      {items.map((item, index) => (
        <div className="flex gap-2 items-center" key={item.label}>
          {index > 0 && <BsChevronCompactRight className="w-4 h-4" />}
          {index < items.length - 1 ? (
            <Button variant="ghost" size="sm" onClick={item.onClick}>
              <div className="text-sm">{item.label}</div>
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
