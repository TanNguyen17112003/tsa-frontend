import { useCallback, useEffect, useMemo } from "react";
import { FaLongArrowAltRight, FaMapMarkerAlt } from "react-icons/fa";
import { HiMagnifyingGlass, HiMiniArrowSmallRight } from "react-icons/hi2";
import { PiBookOpen, PiPhoneCallFill } from "react-icons/pi";
import CommonCard from "src/components/CommonCard";
import { Button } from "src/components/shadcn/ui/button";
import { SiGmail } from "react-icons/si";
import { Input } from "src/components/shadcn/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/shadcn/ui/select";
import { BsExclamationCircle } from "react-icons/bs";
import { useRouter } from "next/router";
import { IoSearch } from "react-icons/io5";
import { SutrasApi } from "src/api/sutras";
import { CustomTable } from "src/components/custom-table";
import useFunction from "src/hooks/use-function";
import { paths } from "src/paths";
import getDashboardSutraTableConfigs from "../getDashboardSutraTableConfigs";
import OverviewStats from "./OverviewStats";
import { useDiaryOrisonsContext } from "src/contexts/diary/activity-logs-context";
import FormInput from "src/components/ui/FormInput";
import searchTypes from "src/modules/Collection/constants/searchTypes";
import CustomSelect from "src/components/CustomSelect";
import useAppSnackbar from "src/hooks/use-app-snackbar";

const OverviewUserPage = () => {
  const router = useRouter();
  const getSutrasApi = useFunction(SutrasApi.getSutras);
  const { orison, goOrison } = useDiaryOrisonsContext();

  const { showSnackbarError } = useAppSnackbar();

  const acceptSearchTypes = useMemo(
    () =>
      searchTypes.filter((searchType) =>
        ["basic", "advance", "adjacent"].includes(searchType.value)
      ),
    []
  );

  const dashboardSutraTableConfigs = useMemo(
    () =>
      getDashboardSutraTableConfigs({
        onClickDetail: (sutra) => {
          router.push({
            pathname: paths.dashboard.collections,
            query: { collectionId: sutra.collection_id, sutraId: sutra.id },
          });
        },
      }),
    [router]
  );

  const handleSeeAll = useCallback(() => {
    router.push({
      pathname: paths.dashboard.collections,
    });
  }, [router]);

  useEffect(() => {
    getSutrasApi.call({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sutras = useMemo(() => {
    return (getSutrasApi.data || []).slice(0, 6);
  }, [getSutrasApi.data]);

  const history = useMemo(() => {
    const activityLog = localStorage.getItem("activityLogs");
    const activity = activityLog ? JSON.parse(activityLog) : [];
    return activity;
  }, []);

  const getNameOrisonById = (id: string) => {
    return orison.find((item) => item.id == id)?.name;
  };

  const handleSearchTypeChange = useCallback(
    (value: string) => {
      router.replace({
        pathname: paths.dashboard.collections,
        query: { ...router.query, searchType: value },
      });
    },
    [router]
  );

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const searchInput: HTMLInputElement = document.getElementById(
      "search"
    ) as HTMLInputElement;
    const wordLength = searchInput.value.replace(/\s+/g, " ").split(" ").length;
    if (wordLength > 15) {
      showSnackbarError("Không thể tìm kiếm quá 15 từ!");
      return;
    }
    const searchValue = searchInput?.value;
    router.replace({
      pathname: paths.dashboard.collections,
      query: { ...router.query, textSearch: searchValue, searchType: "basic" },
    });
  };

  return (
    <div
      className="flex bg-cover bg-center w-full min-h-screen"
      style={{
        backgroundImage: 'url("/background.png")',
      }}
    >
      <div className="flex-1 w-full px-[10%]">
        <div className="text-2xl font-semibold leading-relaxed py-8">
          Trang chủ
        </div>

        <div className="relative w-full h-[357px]">
          <div
            className="flex bg-cover bg-center rounded-xl"
            style={{
              backgroundImage: 'url("/ui/banner chu dai chanh tang.png")',
              width: "100%",
              height: "100%",
            }}
          >
            <div
              className="absolute z-0 bg-cover bg-center rounded-xl"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(170, 79, 2, 1), transparent)",
                width: "30%",
                height: "100%",
              }}
            ></div>
            <div className="z-10 px-[42px] py-[82px] space-y-8">
              <div className="text-4xl font-semibold text-white">
                HỆ THỐNG <br /> ĐẠI TẠNG KINH <br /> VIỆT NAM
              </div>
              <Button
                className="flex bg-cyan-500 hover:bg-cyan-800 space-x-2"
                onClick={handleSeeAll}
              >
                <div className="text-sm font-semibold">Khám phá</div>
                <FaLongArrowAltRight
                  style={{ fontSize: "1rem", marginTop: "2px" }}
                />
              </Button>
            </div>
          </div>
        </div>
        <form className="flex bg-white h-15 my-5" onSubmit={handleSubmit}>
          <div className="flex gap-4 flex-1">
            <div className="flex items-center border border-gray-300 rounded-md w-full divide-x">
              <div className="flex w-full items-center">
                <FormInput
                  type="text"
                  placeholder="Nhập từ khóa tìm kiếm..."
                  className="border-none"
                  id="search"
                />
              </div>
              <CustomSelect
                options={acceptSearchTypes}
                value="basic"
                onValueChange={handleSearchTypeChange}
                className="border-none"
              />
            </div>
            <Button type="submit"> Tìm kiếm</Button>
          </div>
        </form>
        <div className="overflow-hidden">
          <OverviewStats />
        </div>
        <div className="my-8 flex overflow-hidden space-x-5">
          <div className="w-full max-w-[80%] border rounded-3xl bg-white">
            <div className="flex p-5 ">
              <div className="text-lg font-semibold w-full">
                Danh sách bộ kinh
              </div>
              <Button
                variant="ghost"
                className="gap-2 text-primary"
                onClick={handleSeeAll}
              >
                Xem tất cả <HiMiniArrowSmallRight className="h-6 w-6" />
              </Button>
            </div>
            <div className="bg-white ">
              <CustomTable rows={sutras} configs={dashboardSutraTableConfigs} />
            </div>
          </div>
          <CommonCard title="Nhật ký hoạt động">
            {history?.slice(0, 5).map((c: any, index: number) => (
              <div
                key={index}
                className="pb-4 hover:bg-slate-100 cursor-pointer"
                onClick={() => {
                  goOrison(c.orison_id);
                }}
              >
                <div className="flex space-x-2">
                  {c?.action == "Đọc" && (
                    <div className="flex space-x-1 ">
                      <PiBookOpen style={{ fontSize: "1.4em" }} />
                      <div className="text-cyan-600 text-nowrap">
                        {c?.action}
                      </div>
                      <div className="text-black text-nowrap">
                        {" bài kinh "}
                      </div>
                      <div className="text-cyan-600 text-nowrap">
                        {getNameOrisonById(c?.orison_id)}
                      </div>
                    </div>
                  )}
                  {c?.action == "Tìm kiếm" && (
                    <IoSearch style={{ fontSize: "1.4em" }} />
                  )}
                  {c?.action == "Khiếu nại" && (
                    <div className="flex space-x-1">
                      <BsExclamationCircle style={{ fontSize: "1.4em" }} />
                      <div className="text-cyan-600 text-nowrap">
                        {c?.action}
                      </div>
                      <div className="text-black text-nowrap">{" lỗi "}</div>
                      <div className="text-cyan-600 text-nowrap">
                        {"dòng " + c?.lines}
                      </div>
                      <div className="text-black text-nowrap">{" bài "}</div>
                      <div className="text-cyan-600 text-nowrap">
                        {getNameOrisonById(c?.orison_id)}
                      </div>
                    </div>
                  )}
                </div>
                <div key={index} className="text-gray-500 text-xs">
                  {c?.updated_at}
                </div>
              </div>
            ))}
          </CommonCard>
        </div>
        <div className="flex border bg-white p-4 justify-center  overflow-hidden w-full rounded-3xl">
          <div>
            <div className="flex w-full pt-4 space-x-20">
              <div className=" my-4">
                <div className="border p-4 rounded-3xl mb-4">
                  <img src="/logos/logo.png" alt="logo" width="20%" />
                  <div className="text-sm font-medium text-nowrap">
                    Viện nghiên cứu Châu Á
                  </div>
                </div>
                <div>
                  <Button
                    variant={"ghost"}
                    className="pl-4 text-primary text-md"
                    onClick={() => {
                      router.push(paths.dashboard.index);
                    }}
                  >
                    Trang chủ
                  </Button>
                  <Button
                    variant={"ghost"}
                    className="pl-4 text-primary text-md"
                    onClick={() => {
                      router.push(paths.dashboard.collections);
                    }}
                  >
                    Kho dữ liệu
                  </Button>
                  <Button
                    variant={"ghost"}
                    className="pl-4 text-primary text-md"
                    onClick={() => {
                      router.push(paths.dashboard["add-report"]);
                    }}
                  >
                    Khiếu nại
                  </Button>
                </div>
              </div>
              <div className="w-full my-5 pt-5">
                <div className="text-xl font-semibold">Thông tin liên hệ:</div>
                <div className="space-y-5">
                  <div className="flex w-96 mt-6 items-center space-x-3">
                    <FaMapMarkerAlt className="size-7 text-primary" />
                    <div>
                      Địa chỉ: 52/1a tổ 1 khu phố 2, P.An Bình, TP. Biên Hoà,
                      Tỉnh Đồng Nai
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <SiGmail className="size-6 text-primary" />
                    <div>Email: huynguyen21122002@gmail.com</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <PiPhoneCallFill className="size-7 text-primary" />
                    <div>SĐT: 09731259400</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex text-xs font-normal text-secondary w-full justify-center">
              © All rights reserved. Contact: viennghiencuuchaua@gmail.com
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewUserPage;
