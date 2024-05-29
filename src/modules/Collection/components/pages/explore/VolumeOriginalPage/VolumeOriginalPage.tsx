import clsx from "clsx";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState, type FC } from "react";
import { useOrisonsContext } from "src/contexts/orisons/orisons-context";
import CollectionBreadcrumb from "../../../CollectionBreadcrumb";
import { getArrayString, urlToFile } from "src/utils/url-handler";
import useFunction from "src/hooks/use-function";
import PdfViewer from "src/modules/PdfViewer";
import Loading from "src/components/Loading";
import { API_HOST } from "src/utils/api-request";
import { Button } from "src/components/shadcn/ui/button";
import { useCollectionCategoriesContext } from "src/contexts/collections/collection-categories-context";

interface OrisonPageProps {}

const VolumeOriginalPage: FC<OrisonPageProps> = ({}) => {
  const router = useRouter();
  const { goOrison } = useCollectionCategoriesContext();
  const { volume } = useOrisonsContext();
  const [page, setPage] = useState(1);

  const getDocString = useCallback(
    async ({}) => {
      if (!volume?.file) {
        throw "Không có văn bản gốc";
      }

      const file = await urlToFile(`${API_HOST}/${volume.file.path}`);
      if (!file) {
        throw "Không thể tải file văn bản gốc";
      }
      const arrayBuffer = await getArrayString(file);

      if (!arrayBuffer) {
        throw "Không thể tải file văn bản gốc";
      }
      return arrayBuffer;
    },
    [volume?.file]
  );
  const getDocStringHelper = useFunction(getDocString);

  const handleViewOrison = useCallback(() => {
    if (router.query.orisonId) {
      const orisonId = router.query.orisonId.toString();
      goOrison(orisonId);
    }
  }, [goOrison, router.query.orisonId]);

  useEffect(() => {
    if (volume) {
      getDocStringHelper.call({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volume]);

  useEffect(() => {
    const newPage = Number(router.query.docPage);
    if (!isNaN(newPage)) {
      setPage(newPage);
    }
  }, [router.query.docPage]);

  console.log("getDocStringHelper", getDocStringHelper);

  return (
    <div className="h-full flex flex-col">
      <div
        className={clsx("flex justify-between z-50 bg-white sticky top-0 p-4")}
      >
        <CollectionBreadcrumb />
        <Button size="lg" className="px-4" onClick={handleViewOrison}>
          Xem văn bản dịch
        </Button>
      </div>

      <div className="flex-1 min-h-0 bg-white w-full">
        {getDocStringHelper.loading ? (
          <div className="flex h-[100px] items-center justify-center mt-4">
            <Loading />
          </div>
        ) : getDocStringHelper.error ? (
          <div className="flex h-[100px] items-center justify-center mt-4">
            {String(getDocStringHelper.error)}
          </div>
        ) : getDocStringHelper.data ? (
          <PdfViewer
            src={getDocStringHelper.data}
            pageNum={page}
            changePage={setPage}
            scale={2.5}
            showThumbnail={{ scale: 0.5 }}
            rotation={0}
          />
        ) : null}
      </div>
    </div>
  );
};

export default VolumeOriginalPage;
