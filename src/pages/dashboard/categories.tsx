import { useEffect, useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import PageHeader from "src/components/PageHeader";
import { Button } from "src/components/shadcn/ui/button";
import { Input } from "src/components/shadcn/ui/input";
import { useAuth } from "src/hooks/use-auth";
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import CollectionAbbreviation from "src/sections/admin/categories/AcronymsNameTab";
import Abbreviation from "src/sections/admin/categories/AcronymsWordTab";
import AccountManagement from "src/sections/admin/categories/AuthorTab";
import Circa from "src/sections/admin/categories/CircaTab";
import PageFormat from "src/sections/admin/categories/FormatTab";
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
    key: "sort-name",
  },
  {
    label: "Từ viết tắt",
    key: "sort-word",
  },
  {
    label: "Niên đại",
    key: "circa",
  },
];

const Page: PageType = () => {
  const [tab, setTab] = useState(tabs[0].key);
  const tabsMenu = (
    <div className="flex space-x-8 overflow-hidden mt-4">
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
      {tab == "sort-name" ? (
        <div
          onClick={() => setTab("sort-name")}
          className="text-nowrap text-orange-600 border-b border-orange-500 pb-5  cursor-pointer"
        >
          {tabs[2].label}
        </div>
      ) : (
        <div
          onClick={() => setTab("sort-name")}
          className="text-nowrap cursor-pointer"
        >
          {tabs[2].label}
        </div>
      )}
      {tab == "sort-word" ? (
        <div
          onClick={() => setTab("sort-word")}
          className="text-nowrap text-orange-600 border-b border-orange-500 pb-5  cursor-pointer"
        >
          {tabs[3].label}
        </div>
      ) : (
        <div
          onClick={() => setTab("sort-word")}
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
    <div className="flex flex-col divide-y-2">
      <div className="flex-grow ">
        <div className="mt-[32px] mx-[10%]">
          <PageHeader title="Danh mục" tabs={tabsMenu}></PageHeader>
        </div>
        {tab == "author" && <AccountManagement />}
        {tab == "format" && <PageFormat />}
        {tab == "sort-name" && <CollectionAbbreviation />}
        {tab == "sort-word" && <Abbreviation />}
        {tab == "circa" && <Circa />}
      </div>
    </div>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
