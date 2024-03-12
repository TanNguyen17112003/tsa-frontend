import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import PageHeader from "src/components/PageHeader";
import { Button } from "src/components/shadcn/ui/button";
import { Input } from "src/components/shadcn/ui/input";
import AuthorsProvider from "src/contexts/authors/authors-context";
import CircasProvider from "src/contexts/circas/circas-context";
import FormatPagesProvider from "src/contexts/format-pages/format-pages-context";
import FormatSutrasProvider from "src/contexts/format-sutras/format-sutras-context";
import FormatWordsProvider from "src/contexts/format-words/format-words-context";
import { useAuth } from "src/hooks/use-auth";
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import { paths } from "src/paths";
import AcronymsNameTab from "src/sections/admin/categories/AcronymsNameTab";
import AcronymsWordTab from "src/sections/admin/categories/AcronymsWordTab";
import AuthorTab from "src/sections/admin/categories/AuthorTab";
import CircaTab from "src/sections/admin/categories/CircaTab";
import FormatTab from "src/sections/admin/categories/FormatTab";
import type { Page as PageType } from "src/types/page";

const tabs = [
  {
    label: "Quản lý tác giả",
    key: "author",
  },
  {
    label: "Định dạng trang",
    key: "format",
  },
  {
    label: "Tên viết tắt tuyển tập",
    key: "acronym-name",
  },
  {
    label: "Từ viết tắt",
    key: "acronym-word",
  },
  {
    label: "Niên đại",
    key: "circa",
  },
];

const Page: PageType = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.role != "admin") {
      router.push(paths.dashboard.index);
    }
  }, []);

  const [tab, setTab] = useState(tabs[0].key);
  const tabsMenu = (
    <div className="flex space-x-8 overflow-hidden">
      {tab == "author" ? (
        <div
          onClick={() => setTab("author")}
          className="text-nowrap text-orange-600 border-b border-orange-500 pb-5 cursor-pointer"
        >
          {tabs[0].label}
        </div>
      ) : (
        <div
          onClick={() => setTab("author")}
          className="text-nowrap cursor-pointer"
        >
          {tabs[0].label}
        </div>
      )}
      {tab == "format" ? (
        <div
          onClick={() => setTab("format")}
          className="text-nowrap text-orange-600 border-b border-orange-500 pb-5   cursor-pointer"
        >
          {tabs[1].label}
        </div>
      ) : (
        <div
          onClick={() => setTab("format")}
          className="text-nowrap cursor-pointer"
        >
          {tabs[1].label}
        </div>
      )}
      {tab == "acronym-name" ? (
        <div
          onClick={() => setTab("acronym-name")}
          className="text-nowrap text-orange-600 border-b border-orange-500 pb-5  cursor-pointer"
        >
          {tabs[2].label}
        </div>
      ) : (
        <div
          onClick={() => setTab("acronym-name")}
          className="text-nowrap cursor-pointer"
        >
          {tabs[2].label}
        </div>
      )}
      {tab == "acronym-word" ? (
        <div
          onClick={() => setTab("acronym-word")}
          className="text-nowrap text-orange-600 border-b border-orange-500 pb-5  cursor-pointer"
        >
          {tabs[3].label}
        </div>
      ) : (
        <div
          onClick={() => setTab("acronym-word")}
          className="text-nowrap cursor-pointer"
        >
          {tabs[3].label}
        </div>
      )}
      {tab == "circa" ? (
        <div
          onClick={() => setTab("circa")}
          className="text-nowrap text-orange-600 border-b border-orange-500 pb-5  cursor-pointer"
        >
          {tabs[4].label}
        </div>
      ) : (
        <div
          onClick={() => setTab("circa")}
          className="text-nowrap cursor-pointer"
        >
          {tabs[4].label}
        </div>
      )}
    </div>
  );
  return (
    <div className="flex flex-col">
      {user?.role == "admin" && (
        <>
          <div className="w-full ">
            <PageHeader title="Danh mục" tabs={tabsMenu}></PageHeader>
            {tab == "author" && <AuthorTab />}
            {tab == "format" && <FormatTab />}
            {tab == "acronym-name" && <AcronymsNameTab />}
            {tab == "acronym-word" && <AcronymsWordTab />}
            {tab == "circa" && <CircaTab />}
          </div>
        </>
      )}
    </div>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    <AuthorsProvider>
      <FormatPagesProvider>
        <FormatSutrasProvider>
          <FormatWordsProvider>
            <CircasProvider>{page}</CircasProvider>
          </FormatWordsProvider>
        </FormatSutrasProvider>
      </FormatPagesProvider>
    </AuthorsProvider>
  </DashboardLayout>
);

export default Page;
