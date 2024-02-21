import { useEffect, useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import PageHeader from "src/components/PageHeader";
import { Button } from "src/components/shadcn/ui/button";
import { Input } from "src/components/shadcn/ui/input";
import { useAuth } from "src/hooks/use-auth";
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import PageFormat from "src/section/danh-muc/dinh-dang-trang";
import Chronology from "src/section/danh-muc/nien-dai";
import AccountManagement from "src/section/danh-muc/quan-ly-tac-gia";
import CollectionAbbreviation from "src/section/danh-muc/ten-viet-tat-tuyen-tap";
import Abbreviation from "src/section/danh-muc/tu-viet-tat";
import type { Page as PageType } from "src/types/page";

const tabs = [
  {
    label: "Quản lý tác giả",
    key: "1",
  },
  {
    label: "Định dạng trang",
    key: "2",
  },
  {
    label: "Tên viết tắt tuyển tập",
    key: "3",
  },
  {
    label: "Từ viết tắt",
    key: "4",
  },
  {
    label: "Niên đại",
    key: "5",
  },
];

const Page: PageType = () => {
  const [tab, setTab] = useState(tabs[0].key);
  const tabsMenu = (
    <div className="flex space-x-4 overflow-hidden mt-4">
      {tab == "1" ? (
        <div
          onClick={() => setTab("1")}
          className="text-nowrap text-orange-600 border-b border-orange-500 pb-5 cursor-pointer"
        >
          {tabs[0].label}
        </div>
      ) : (
        <div onClick={() => setTab("1")} className="text-nowrap cursor-pointer">
          {tabs[0].label}
        </div>
      )}
      {tab == "2" ? (
        <div
          onClick={() => setTab("2")}
          className="text-nowrap text-orange-600 border-b border-orange-500 pb-5   cursor-pointer"
        >
          {tabs[1].label}
        </div>
      ) : (
        <div onClick={() => setTab("2")} className="text-nowrap cursor-pointer">
          {tabs[1].label}
        </div>
      )}
      {tab == "3" ? (
        <div
          onClick={() => setTab("3")}
          className="text-nowrap text-orange-600 border-b border-orange-500 pb-5  cursor-pointer"
        >
          {tabs[2].label}
        </div>
      ) : (
        <div onClick={() => setTab("3")} className="text-nowrap cursor-pointer">
          {tabs[2].label}
        </div>
      )}
      {tab == "4" ? (
        <div
          onClick={() => setTab("4")}
          className="text-nowrap text-orange-600 border-b border-orange-500 pb-5  cursor-pointer"
        >
          {tabs[3].label}
        </div>
      ) : (
        <div onClick={() => setTab("4")} className="text-nowrap cursor-pointer">
          {tabs[3].label}
        </div>
      )}
      {tab == "5" ? (
        <div
          onClick={() => setTab("5")}
          className="text-nowrap text-orange-600 border-b border-orange-500 pb-5  cursor-pointer"
        >
          {tabs[4].label}
        </div>
      ) : (
        <div onClick={() => setTab("5")} className="text-nowrap cursor-pointer">
          {tabs[4].label}
        </div>
      )}
    </div>
  );
  return (
    <div className="flex flex-col divide-y-2">
      <div className="flex-grow mx-[10%]">
        <div className="mt-[32px]">
          <PageHeader title="Danh mục" tabs={tabsMenu}></PageHeader>
        </div>
        {tab == "1" && <AccountManagement></AccountManagement>}
        {tab == "2" && <PageFormat></PageFormat>}
        {tab == "3" && <CollectionAbbreviation></CollectionAbbreviation>}
        {tab == "4" && <Abbreviation></Abbreviation>}
        {tab == "5" && <Chronology></Chronology>}
      </div>
      {/* <div className="flex px-7">
        <div className="flex text-sm text-gray-500 font-normal items-center overflow-hidden text-nowrap">
          Đang hiển thị kết quả thứ 1 tới 10 trên 97 kết quả
        </div>
        <div className="flex items-center border rounded-lg ml-auto divide-x-2 my-2">
          <a href="#" className="border px-3 py-1.5">
            &lt;
          </a>
          <a
            href="#"
            className="border border-orange-500 px-3 py-1.5 bg-[#F97316]"
          >
            1
          </a>
          <a href="#" className="border px-3 py-1.5">
            2
          </a>
          <a href="#" className="border px-3 py-1.5">
            3
          </a>
          <span className="border px-3 py-1.5">...</span>
          <a href="#" className="border px-3 py-1.5">
            8
          </a>
          <a href="#" className="border px-3 py-1.5">
            9
          </a>
          <a href="#" className="border px-2 py-1.5">
            10
          </a>
          <a href="#" className="border px-3 py-1.5">
            &gt;
          </a>
        </div>
      </div> */}
    </div>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
