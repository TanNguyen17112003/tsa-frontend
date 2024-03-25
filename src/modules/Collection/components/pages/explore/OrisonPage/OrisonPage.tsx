import clsx from "clsx";
import { useRouter } from "next/router";
import { FormEvent, useCallback, useState, type FC } from "react";
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
import { useOrisonsContext } from "src/contexts/orisons/orisons-context";
import PlateEditor from "src/modules/Editor";
import AudioPlayer from "../../../AudioPlayer";
import CollectionBreadcrumb from "../../../CollectionBreadcrumb";
import OrisonList from "./OrisonList";
import OrisonPagination from "./OrisonPagination";
import { useAuth } from "src/hooks/use-auth";
import exportDocx from "src/modules/Editor/utils/docx";
import { downloadFile } from "src/utils/url-handler";
import useFunction from "src/hooks/use-function";
import OrisonComplainDialog from "./OrisonCompainDialog";
import { BaseSelection } from "slate";

interface OrisonPageProps {}

const OrisonPage: FC<OrisonPageProps> = ({}) => {
  const { user } = useAuth();
  const { getOrisonDetailApi, updateOrison } = useOrisonsContext();
  const [searchText, setSearchText] = useState("");
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [data, setData] = useState<string>("");
  const [selection, setSelection] = useState<BaseSelection>();

  const isEditting = router.query.isEditting == "true";
  const isFullScreen = router.query.isFullScreen == "true";
  const currentOrison = getOrisonDetailApi.data;

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
                <BiSearch className="w-5 h-5 mx-2" />
              </form>
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
                    data={data}
                    selection={selection}
                  />
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2 px-4"
                    onClick={handleDownload}
                  >
                    <PiDownloadSimpleBold className="w-5 h-5" /> Tải văn bản
                    dịch
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
                  <Button size="lg" className="px-4">
                    Xem văn bản gốc
                  </Button>
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

        <div className="pl-[260px] flex-1 min-h-0 bg-white">
          <div className="bg-white absolute left-0 px-4 w-[260px]">
            <OrisonList />
          </div>
          <div className="border rounded-xl h-full overflow-y-auto">
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
                setDataReport={setData}
                setSelectionReport={setSelection}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrisonPage;
