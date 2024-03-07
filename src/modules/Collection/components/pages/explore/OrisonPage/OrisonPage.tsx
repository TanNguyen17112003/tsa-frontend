import clsx from "clsx";
import { useRouter } from "next/router";
import { useCallback, useState, type FC, useRef, FormEvent } from "react";
import {
  PiDownloadSimpleBold,
  PiFlagBold,
  PiNotePencilBold,
} from "react-icons/pi";
import Loading from "src/components/Loading";
import { Button } from "src/components/shadcn/ui/button";
import { useOrisonsContext } from "src/contexts/orisons/orisons-context";
import PlateEditor from "src/modules/Editor";
import CollectionBreadcrumb from "../../../CollectionBreadcrumb";
import OrisonPagination from "./OrisonPagination";
import { BiSearch } from "react-icons/bi";
import FormInput from "src/components/ui/FormInput";

interface OrisonPageProps {}

const OrisonPage: FC<OrisonPageProps> = ({}) => {
  const { getOrisonsApi, orisonId, getOrisonDetailApi } = useOrisonsContext();
  const [isEditting, setIsEditting] = useState(false);
  const [searchText, setSearchText] = useState("");
  const router = useRouter();

  const handleChangeOrison = useCallback(
    (id: string) => {
      router.replace({
        pathname: router.pathname,
        query: { ...router.query, orisonId: id },
      });
    },
    [router]
  );

  const handleSearch = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchInput: HTMLInputElement = document.getElementById(
      "search"
    ) as HTMLInputElement;
    const searchValue = searchInput?.value;
    setSearchText(searchValue);
  }, []);

  const handleSave = useCallback((value: any) => {
    setIsEditting(false);
  }, []);

  const handleCancel = useCallback(() => {
    setIsEditting(false);
  }, []);

  return (
    <>
      <div className="flex justify-between p-4 border-b sticky top-0">
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
              <Button size="lg" variant="outline" className="gap-2 px-4">
                <PiFlagBold className="w-5 h-5" />
                Khiếu nại
              </Button>
              <Button size="lg" variant="outline" className="gap-2 px-4">
                <PiDownloadSimpleBold className="w-5 h-5" /> Tải văn bản dịch
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 px-4"
                onClick={() => {
                  setIsEditting(!isEditting);
                }}
              >
                <PiNotePencilBold className="w-5 h-5" /> Chỉnh sửa
              </Button>
              <Button size="lg" className="px-4">
                Xem văn bản gốc
              </Button>
            </>
          )}
        </div>
        <div
          className={clsx(
            "w-[220px] border overflow-y-auto pb-[60px] mt-[60px] mx-4 rounded-lg absolute left-0 top-full"
          )}
        >
          <div className="p-3 text-lg font-semibold text-text-secondary">
            Mục lục
          </div>
          <hr />
          <div className="flex flex-col gap-1 pt-4 px-2">
            {getOrisonsApi.data?.map((orison) => (
              <Button
                key={orison.id}
                variant="ghost"
                className={clsx(
                  "w-full justify-start text-primary",
                  orison.id == orisonId && "bg-accent"
                )}
                onClick={() => handleChangeOrison(orison.id)}
              >
                {orison.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="pl-[252px] h-full overflow-y-auto">
        {!isEditting && (
          <div className="flex justify-end p-4 py-3 sticky left-0 top-0 z-50 w-full border-b mb-[-1px] bg-white">
            <OrisonPagination />
          </div>
        )}
        {getOrisonDetailApi.loading ? (
          <div className="flex h-[100px] items-center justify-center mt-4">
            <Loading />
          </div>
        ) : getOrisonDetailApi.data &&
          getOrisonDetailApi.data.id == orisonId ? (
          <>
            <PlateEditor
              readOnly={!isEditting}
              initialValue={getOrisonDetailApi.data.content}
              notes={getOrisonDetailApi.data.notes}
              onUpdateNotes={() => {}}
              onChange={() => {}}
              onSave={handleSave}
              onCancel={handleCancel}
              searchText={searchText.toLowerCase()}
            />
          </>
        ) : null}
      </div>
    </>
  );
};

export default OrisonPage;
