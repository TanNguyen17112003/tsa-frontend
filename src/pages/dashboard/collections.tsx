import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { BiSearch } from "react-icons/bi";
import Loading from "src/components/Loading";
import PageHeader from "src/components/PageHeader";
import { Button } from "src/components/shadcn/ui/button";
import { paths } from "src/paths";
import type { Page as PageType } from "src/types/page";

const Collection = dynamic(() => import("src/modules/Collection"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[100px]">
      <Loading />
    </div>
  ),
});

const Page: PageType = () => {
  const router = useRouter();

  const handleClickSearch = useCallback(() => {
    const newQuery: any = {};
    Object.keys(router.query).forEach((key) =>
      key.startsWith("q") ? null : (newQuery[key] = router.query[key])
    );
    router.replace({
      pathname: router.pathname,
      query: { searchType: "basic" },
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
      <Collection />
    </div>
  );
};

Page.getLayout = (page) => <>{page}</>;

export default Page;
