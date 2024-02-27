import { useRouter } from "next/router";
import { useCallback } from "react";
import { BiSearch } from "react-icons/bi";
import PageHeader from "src/components/PageHeader";
import { Button } from "src/components/shadcn/ui/button";
import Collection from "src/modules/Collection";
import { paths } from "src/paths";
import type { Page as PageType } from "src/types/page";

const Page: PageType = () => {
  const router = useRouter();

  const handleClickSearch = useCallback(() => {
    const newQuery: any = {};
    Object.keys(router.query).forEach((key) =>
      key.startsWith("q") ? null : (newQuery[key] = router.query[key])
    );
    router.replace({
      pathname: router.pathname,
      query: { ...newQuery, searchType: "basic" },
    });
  }, [router]);

  return (
    <div className="h-screen relative min-h-0">
      <PageHeader
        title="Kho dữ liệu"
        variant="full-divide"
        backLink={paths.dashboard.index}
        className="relative h-[116px] py-0"
        button={
          <Button variant="outline" onClick={handleClickSearch}>
            <BiSearch className="w-6 h-6" />
          </Button>
        }
      />
      <div className="h-[calc(100vh_-_116px)] relative overflow-y-scroll">
        <Collection
          sideNavClassName="fixed top-[116px] left-0 z-10"
          className=""
        ></Collection>
      </div>
    </div>
  );
};

Page.getLayout = (page) => <>{page}</>;

export default Page;
