import clsx from "clsx";
import { formatDate } from "date-fns";
import { useRouter } from "next/router";
import { FormEvent, useCallback, useEffect, useState, useMemo, type FC } from "react";
import { BiSearch } from "react-icons/bi";
import { BsArrowsAngleContract, BsArrowsAngleExpand } from "react-icons/bs";
import {
  PiDownloadSimpleBold,
  PiFlagBold,
  PiNotePencilBold,
} from "react-icons/pi";
import Loading from "src/components/Loading";
import { Button } from "src/components/shadcn/ui/button";
import FormInput from "src/components/ui/FormInput";
import { useCollectionCategoriesContext } from "src/contexts/collections/collection-categories-context";
import { useOrisonsContext } from "src/contexts/orisons/orisons-context";
import { useAuth } from "src/hooks/use-auth";
import useFunction from "src/hooks/use-function";
import PlateEditor from "src/modules/Editor";
import exportDocx from "src/modules/Editor/utils/docx";
import { downloadFile } from "src/utils/url-handler";
import AudioPlayer from "../../../AudioPlayer";
import CollectionBreadcrumb from "../../../CollectionBreadcrumb";
import OrisonComplainDialog from "./OrisonCompainDialog";
import OrisonList from "./OrisonList";
import OrisonPagination from "./OrisonPagination";
import { SelectionData } from "src/modules/Editor/types";
import { useReportsContext } from "src/contexts/reports/reports-context";
import ReportOfOrison from "src/components/ReportOfOrison";
import { useOrisonPath } from "../OrisonExplorePage/orisonPath";
import { useSutrasContext } from "src/contexts/sutras/sutras-context";
import { useCollectionsContext } from "src/contexts/collections/collections-context";
import { useVolumesContext } from "src/contexts/volumes/volumes-context";
interface OrisonPageProps {}

const OrisonPage: FC<OrisonPageProps> = ({}) => {
  const router = useRouter();
  const { user } = useAuth();
  const { getReportsApi } = useReportsContext();
  const { goVolume } = useCollectionCategoriesContext();
  const { getOrisonDetailApi, updateOrison, volume, getOrisonsApi } = useOrisonsContext();
  const {getSutrasApi} = useSutrasContext();
  const {getVolumesApi} = useVolumesContext();
  const [searchText, setSearchText] = useState("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectionData, setSelectionData] = useState<SelectionData>();

  const isEditting = router.query.isEditting == "true";
  const isFullScreen = router.query.isFullScreen == "true";
  const currentOrison = getOrisonDetailApi.data;

  const detailReport = useMemo(() => {
    return (getReportsApi.data || []).find((item) => item.id === router.query.reportId);
  }, [getReportsApi.data, router])

  const handleSearch = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchInput: HTMLInputElement = document.getElementById(
      "search"
    ) as HTMLInputElement;
    const searchValue = searchInput?.value;
    setSearchText(searchValue);
  }, []);

  const handleClickEdit = useCallback(() => {
    router.replace({
      pathname: router.pathname,
      query: { ...router.query, isEditting: "true" },
    });
  }, [router]);

  const handleChangeFullScreen = useCallback(() => {
    router.replace({
      pathname: router.pathname,
      query: {
        ...router.query,
        isFullScreen: router.query.isFullScreen == "true" ? "" : "true",
      },
    });
  }, [router]);

  const handleDownload = useCallback(async () => {
    if (currentOrison) {
      const file = await exportDocx(currentOrison.content);
      downloadFile(file, currentOrison.name + ".docx");
    }
  }, [currentOrison]);

  const handleSave = useFunction(
    useCallback(
      async (value: any) => {
        updateOrison({ ...currentOrison, content: value });
        router.replace({
          pathname: router.pathname,
          query: { ...router.query, isEditting: "" },
        });
      },
      [currentOrison, router, updateOrison]
    ),
    { successMessage: "Lưu thành công!" }
  );

  const handleCancel = useCallback(() => {
    router.replace({
      pathname: router.pathname,
      query: { ...router.query, isEditting: "" },
    });
  }, [router]);

  const handleViewOriginal = useCallback(() => {
    const pageString = selectionData?.pageMark.substring(1, 5) || "0000";
    const pageNum = Number(pageString.replace(/^[0-9]/g, ""));
    if (volume?.id) {
      goVolume(volume?.id, { page: isNaN(pageNum) ? 0 : pageNum });
    }
  }, [goVolume, selectionData, volume?.id]);

  useEffect(() => {
    if (currentOrison?.name) {
      const activityLog = localStorage.getItem("activityLogs");
      const activity = activityLog ? JSON.parse(activityLog) : [];
      const currentDay = new Date();

      activity.unshift({
        action: "Đọc",
        updated_at: formatDate(currentDay, "hh:mm - dd/MM/yy"),
        lines: "",
        orison_id: currentOrison.id,
        user_id: user?.id || "",
      });

      localStorage.setItem("activityLogs", JSON.stringify(activity));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentOrison]);
  useEffect(() => {
    const handleQuery = () => {
      if (!router.query.volumeId) {
        const volumeId = getOrisonsApi.data?.find((orison) => orison.id === router.query.orisonId)?.volume_id;
        const sutraId = getVolumesApi.data?.find((volume) => volume.id === volumeId)?.sutras_id;
        const collectionId = getSutrasApi.data?.find((sutra) => sutra.id === sutraId)?.collection_id;
        if(volumeId && sutraId && collectionId) {
          router.replace({
            pathname: router.pathname,
            query: { ...router.query, volumeId: volumeId, sutraId: sutraId, collectionId: collectionId },
          })
        }
      }
    }
    handleQuery();
  }, [router.query.orisonId])

  return (
    <div className="h-full flex flex-col">
      <div
        className={clsx(
          "flex justify-between z-50 bg-white sticky top-0",
          !isFullScreen && "p-4 border-b"
        )}
      >
        {!isFullScreen && (
          <>
            <CollectionBreadcrumb />
            <div className="flex gap-3 items-center">
              <div></div>
              <form
                className="flex items-center border rounded-md w-full"
                onSubmit={handleSearch}
              >
                <FormInput
                  type="text"
                  placeholder="Tìm kiếm văn bản..."
                  name="search"
                  id="search"
                  className="border-none"
                />
                <button>
                  <BiSearch className="w-5 h-5 mx-2" />
                </button>
              </form>x
              {!isEditting && (
                <>
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2 px-4"
                    onClick={() => {
                      setIsOpen(true);
                    }}
                  >
                    <PiFlagBold className="w-5 h-5" />
                    Khiếu nại
                  </Button>
                  <OrisonComplainDialog
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    data={selectionData?.text || ""}
                    selection={selectionData?.selection}
                    orisonId={currentOrison?.id}
                  />
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2 px-4"
                    onClick={handleDownload}
                  >
                    <PiDownloadSimpleBold className="w-5 h-5" />
                    Tải văn bản dịch
                  </Button>
                  {user?.role == "admin" && (
                    <Button
                      size="lg"
                      variant="outline"
                      className="gap-2 px-4"
                      onClick={handleClickEdit}
                    >
                      <PiNotePencilBold className="w-5 h-5" /> Chỉnh sửa
                    </Button>
                  )}

                  {volume?.file_id && (
                    <Button
                      size="lg"
                      className="px-4"
                      disabled={!volume?.file_id}
                      onClick={handleViewOriginal}
                    >
                      Xem văn bản gốc
                    </Button>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
      <div className="flex flex-col flex-1 min-h-0">
        {!isEditting && (
          <div
            className={clsx(
              "flex justify-end w-full bg-white left-0 relative z-40 gap-4 py-3 px-3",
              isFullScreen ? "p-0" : "px-4 pt-3"
            )}
          >
            <AudioPlayer audioSrc="/audio/audio.mp3" label="Đọc bài kinh" />
            {!isFullScreen && <OrisonPagination />}
            <Button
              variant="ghost"
              className="absolute top-full right-0 h-auto p-4 hover:bg-blue/60"
              onClick={handleChangeFullScreen}
            >
              {!isFullScreen ? (
                <BsArrowsAngleExpand className="w-6 h-6 fill-blue-600 stroke-blue-600 stroke-1" />
              ) : (
                <BsArrowsAngleContract className="w-6 h-6 fill-blue-600 stroke-blue-600 stroke-1" />
              )}
            </Button>
          </div>
        )}

        <div className="flex-1 min-h-0 bg-white flex gap-4 pl-4">
          <OrisonList className="w-[228px] h-full" />
          <div
            className="border rounded-xl h-full overflow-y-auto flex-1"
            id="editor-container"
          >
            {getOrisonDetailApi.loading ? (
              <div className="flex h-[100px] items-center justify-center mt-4">
                <Loading />
              </div>
            ) : currentOrison ? (
                <PlateEditor
                  readOnly={!isEditting}
                  initialValue={currentOrison.content}
                  notes={currentOrison.notes}
                  onUpdateNotes={() => {}}
                  onChange={() => {}}
                  onSave={handleSave.call}
                  onCancel={handleCancel}
                  searchText={searchText.toLowerCase()}
                  onChangeSelection={setSelectionData}
                  scrollOffset={-300}
                />
            ) : null}
          </div>

          {router.query.reportId && <ReportOfOrison status={detailReport?.report_status === "pending" ? "Chưa xử lý" : (detailReport?.report_status === "processed" ? "Đã xử lý" : "")} email={detailReport?.email || ""} created_at={detailReport?.created_at.toString() || ""} title={detailReport?.title || ""} content={detailReport?.content || ""}/>}
        </div>
      </div>  
    </div>
  );
};

export default OrisonPage;
