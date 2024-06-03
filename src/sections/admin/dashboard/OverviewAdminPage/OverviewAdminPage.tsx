import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { HiMagnifyingGlass, HiMiniArrowSmallRight } from "react-icons/hi2";
import { LuClock } from "react-icons/lu";
import { PiBookOpen } from "react-icons/pi";
import { ReportsApi } from "src/api/reports";
import CommonCard from "src/components/CommonCard";
import { CustomTable } from "src/components/custom-table";
import { Button } from "src/components/shadcn/ui/button";
import { Input } from "src/components/shadcn/ui/input";
import BasicSearchForm from "src/modules/Collection/components/pages/search/BasicSearchPage/BasicSearchForm";
import AdvanceSearchForm from "src/modules/Collection/components/pages/search/AdvanceSearchPage/AdvanceSearchForm";
import AdjacentSearchForm from "src/modules/Collection/components/pages/search/AdjacentSearchPage/AdjacentSearchForm";
import { ReportDetail } from "src/types/report";



import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/shadcn/ui/select";
import useFunction from "src/hooks/use-function";
import { paths } from "src/paths";
import reportTableConfig from "./ReportTableConfig";
import { initialReport } from "src/types/report";
import ReportDialog from "../../reports/ReportDialog";

const children = [
  { title: "Bài dịch số 23", time: "15:30 - 01/12/2023" },
  { title: "Bài dịch số 20", time: "15:30 - 01/12/2023" },
  { title: "Bài dịch số 21", time: "15:30 - 01/12/2023" },
  { title: "Bài dịch số 24", time: "15:30 - 01/12/2023" },
  { title: "Bài dịch số 26", time: "15:30 - 01/12/2023" },
];

const history = [
  { title: "Đọc bài kinh 1: Bài dịch số 2", time: "15:30 - 01/12/2023" },
  { title: "Tìm kiếm bài dịch số 62", time: "15:30 - 01/12/2023" },
  { title: "Đọc bài kinh 7: Bài dịch số 20", time: "15:30 - 01/12/2023" },
  { title: "Đọc bài kinh 3: Bài dịch số 21", time: "15:30 - 01/12/2023" },
  { title: "Tìm kiếm bài dịch số 62", time: "15:30 - 01/12/2023" },
  { title: "Đọc bài kinh 11: Bài dịch số 24", time: "15:30 - 01/12/2023" },
  { title: "Tìm kiếm bài dịch số 62", time: "15:30 - 01/12/2023" },
  { title: "Đọc bài kinh 5: Bài dịch số 26", time: "15:30 - 01/12/2023" },
];

const OverviewAdminPage = () => {
  const router = useRouter();
  const searchType = router.query.searchType;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [data, setData] = useState(initialReport);

  const getReportsApi = useFunction(ReportsApi.getReports);

  useEffect(() => {
    getReportsApi.call({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSeeAll = useCallback(() => {
    router.push({
      pathname: paths.dashboard.reports,
    });
  }, [router]);
  
  const report = useMemo(() => {
    return getReportsApi.data || [];
  }, [getReportsApi.data]);

  const getReportTableConfig = useMemo(() => {
    return reportTableConfig({
      setData: (data) => {
        setData(data);
      },
      setIsOpen: (đata) => {
        setIsOpen(true);
      },
    });
  }, []);

  return (
    <div
      className="flex bg-cover bg-center min-h-screen"
      style={{
        backgroundImage: 'url("/background.png")',
        width: "calc(100vw - 600px)",
      }}
    >
      <div className="flex-1 w-full p-6">
        <div className="text-2xl font-semibold leading-relaxed">
          Tổng quan hệ thống
        </div>
        <div className="bg-white h-15 my-5">
            {(searchType === "basic" || searchType === undefined) ? (
              <BasicSearchForm className={"py-4 px-6"}/>
            ) : searchType === "advance" ? (
              <AdvanceSearchForm className={"py-4 px-6"}/>    
            ) : <AdjacentSearchForm className={"py-4 px-6"} />}
        </div>
        <div className="relative w-full h-80">
          <div
            className="bg-cover bg-center rounded-2xl"
            style={{
              backgroundImage: 'url("/ui/banner chu dai chanh tang.png")',
              width: "100%",
              height: "100%",
            }}
          ></div>
          {/* <div className="flex absolute bottom-0 left-0 w-full h-[60%]">
            <div className="flex flex-col bg-white rounded-2xl shadow-md w-[35%] overflow-hidden">
              <div className="flex items-center w-full pt-7 pl-[8%]">
                <div className="px-[2%]">
                  <BookshelfIcon className="h-4 w-4" />
                </div>
                <div className="p-3">
                  <h2 className="text-base text-[#374151] text-nowrap">
                    Bài kinh
                  </h2>
                  <p className="text-4xl font-bold">2406</p>
                </div>
              </div>
              <div className="flex items-end justify-items-end text-nowrap pr-4 pb-4 cursor-pointer">
                <div className="flex border ml-auto border-gray-300 rounded-lg px-2 hover:bg-gray-100">
                  <p className="text-xs font-semibold m-1 ml-3">Chi tiết</p>
                  <HiMiniArrowSmallRight style={{ fontSize: "1.4em" }} />
                </div>
              </div>
            </div>
            <div className="flex flex-col bg-white rounded-2xl shadow-md w-[35%] ml-4 overflow-hidden">
              <div className="flex items-center w-full pt-7 pl-[8%]">
                <div className="px-[2%]">
                  <BsPersonCircle className="h-7 w-7" />
                </div>
                <div className="p-3">
                  <h2 className="text-base text-[#374151] text-nowrap">
                    Tài khoản dịch giả
                  </h2>
                  <p className="text-4xl font-bold">2406</p>
                </div>
              </div>
              <div className="flex items-end justify-items-end text-nowrap pr-4 pb-4 cursor-pointer">
                <div className="flex border ml-auto border-gray-300 rounded-lg px-2  hover:bg-gray-100">
                  <p className="text-xs font-semibold m-1 ml-3">Chi tiết</p>
                  <HiMiniArrowSmallRight style={{ fontSize: "1.4em" }} />
                </div>
              </div>
            </div>
          </div> */}
        </div>
        <div className="flex mt-4">
          <div className="bg-white border border-gray-300 rounded-2xl mr-4 p-5 overflow-auto h-full w-full">
            <div className="flex space-x-64 w-full">
              <p className="text-lg font-semibold w-full text-nowrap p-3">
                Khiếu nại chưa giải quyết ({report.length})
              </p>
              <Button
                variant="ghost"
                className="gap-2 text-primary"
                onClick={handleSeeAll}
              >
                Xem tất cả <HiMiniArrowSmallRight className="h-6 w-6" />
              </Button>
            </div>
            <CustomTable
              rows={report}
              configs={getReportTableConfig}
              tableClassName="rounded-xl border-2"
              indexColumn
            ></CustomTable>

            <ReportDialog
              state={isOpen}
              onClose={() => setIsOpen(false)}
              data={data}
            />
          </div>
          <CommonCard
            link="/dashboard"
            linkLabel="Xem tất cả"
            title="Bài dịch mới nhất"
          >
            {children.map((c, index) => (
              <div key={index} className="pb-4">
                <PiBookOpen style={{ fontSize: "1.4em" }} />
                <div key={index} className="text-black-700">
                  {c.title}
                </div>
                <div key={index} className="text-gray-500 text-xs">
                  {c.time}
                </div>
              </div>
            ))}
          </CommonCard>
        </div>
      </div>
      <div className="fixed flex-1 right-0 border border-gray-300 overflow-auto rounded-tl-3xl rounded-bl-3xl bg-white h-full ml-3 divide-y-2 min-w-80">
        <div className="mb-4 m-6">
          <LuClock style={{ fontSize: "1.3em", margin: "10px 0" }} />
          <h2 className="text-lg font-semibold">Lịch sử hoạt động hệ thống</h2>
        </div>
        <div className="space-y-8">
          <div className="mt-4"></div>
          {history.map((h, index) => (
            <div key={index} className="m-6">
              <div className="text-cyan-500">{h.title}</div>
              <div className="text-gray-500 text-xs">{h.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverviewAdminPage;
