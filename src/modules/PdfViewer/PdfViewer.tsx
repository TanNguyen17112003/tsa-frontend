import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  CSSProperties,
} from "react";
import * as pdfjs from "pdfjs-dist";
import { PDFDocumentProxy } from "pdfjs-dist";

interface PDFImage {
  image: any;
  height: any;
  width: any;
}

function usePrevious<T>(value: T) {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

interface PdfViewerProps {
  document: { url?: string; base64?: string };
  password?: { url?: string; base64?: string };
  pageNum: number;
  scale: number;
  rotation: number;
  changePage?: (pageNumber: number) => void;
  pageCount?: (count: number) => void;
  showThumbnail?: {
    scale?: number;
    rotationAngle?: number;
    onTop?: boolean;
    backgroundColor?: string;
    thumbCss?: string;
    selectedThumbCss?: string;
  };
  protectContent?: boolean;
  canvasCss?: string;
}

const PdfViewer: React.FC<PdfViewerProps> = ({
  document,
  password,
  pageNum,
  scale,
  rotation,
  changePage,
  pageCount,
  showThumbnail,
  protectContent,
  canvasCss,
}) => {
  const [pdf, setPDF] = useState<PDFDocumentProxy | null>(null);
  const [thumbnailImages, setThumbnailImages] = useState<PDFImage[]>([]);
  const [prevRenderTask, setPrevRenderTask] = useState<pdfjs.RenderTask | null>(
    null
  );
  const [error, setError] = useState({ status: false, message: "" });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const thumbnailRef = useRef<HTMLCanvasElement | null>(null);
  const selectedRef = useRef<HTMLImageElement | null>(null);

  const [thumbnails, setThumbnails] = useState<React.JSX.Element[]>([]);

  const prevDocument = usePrevious(document);
  const prevPassword = usePrevious(password);

  const displayPage = useCallback(
    async (pdfDoc?: PDFDocumentProxy | null) => {
      // display pdf page
      if (pdfDoc == null) {
        pdfDoc = pdf;
      }

      if (!pdfDoc) {
        console.log("no pdfDoc");
        return;
      }

      if (!canvasRef.current) {
        console.log("no canvas");
        return;
      }

      try {
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale, rotation });

        // Prepare canvas using PDF page dimensions
        const canvas = canvasRef.current;
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render PDF page into canvas context
        let canvasContext = canvas.getContext("2d");
        if (!canvasContext) {
          throw "Failed to get canvas context";
        }
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);
        canvasContext.beginPath();
        const renderContext = {
          canvasContext,
          viewport,
        };
        const renderTask = page.render(renderContext);
        // cancel previous render task
        if (prevRenderTask != null) {
          prevRenderTask.cancel();
        }
        try {
          await renderTask.promise;
        } catch (error) {
          console.warn("Error occured while rendering !\n", error);
          pageCount?.(-1); // set page count to -1 on error
          setError({
            status: true,
            message: "Error occured while rendering !",
          });
        }
        setPrevRenderTask(renderTask);
      } catch (error) {
        console.warn("Error while reading the pages !\n", error);
        pageCount?.(-1); // set page count to -1 on error
        setError({
          status: true,
          message: "Error while reading the pages !",
        });
      }
    },
    [pageCount, pageNum, pdf, prevRenderTask, rotation, scale]
  );

  const createImages = useCallback(
    async (pdf: PDFDocumentProxy) => {
      // create images for all pages
      const imgList = [];

      if (!thumbnailRef.current) {
        console.log("no thumb canvas");
        return;
      }

      if (Object.entries(showThumbnail || {}).length !== 0) {
        let thumbnailScal = showThumbnail?.scale || 1;
        let scale = 0.1;
        let rotation = 0;
        if (1 <= thumbnailScal && thumbnailScal <= 5) {
          scale = thumbnailScal / 10;
        }
        if (
          showThumbnail?.rotationAngle === -90 ||
          showThumbnail?.rotationAngle === 90
        ) {
          rotation = showThumbnail.rotationAngle;
        }

        for (let pageNo = 1; pageNo <= pdf.numPages; pageNo++) {
          const page = await pdf.getPage(pageNo);
          const viewport = page.getViewport({ scale, rotation });

          // Prepare canvas using PDF page dimensions
          const canvas = thumbnailRef.current;
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          // Render PDF page into canvas context
          let canvasContext = canvas.getContext("2d");
          if (canvasContext) {
            canvasContext.clearRect(0, 0, canvas.width, canvas.height);
            canvasContext.beginPath();
            const renderContext = {
              canvasContext,
              viewport,
            };
            const renderTask = page.render(renderContext);
            await renderTask.promise;
          }

          // create image from canvas and push into array
          imgList.push({
            image: canvas.toDataURL("image/png"),
            height: viewport.height,
            width: viewport.width,
          });
        }
      }
      return imgList;
    },
    [showThumbnail]
  );

  const displayThumbnails = useCallback(
    (images: PDFImage[]) => {
      if (Object.entries(showThumbnail || {}).length !== 0 && images !== null) {
        // display thumbnails for all pages
        const thumbnailList = [];

        for (let pageNo = 1; pageNo <= images.length; pageNo++) {
          let image = images[pageNo - 1].image;
          let height = images[pageNo - 1].height;
          let width = images[pageNo - 1].width;
          let thumbnailCss = "";
          let thumbnailStyle: CSSProperties = {
            height,
            width,
            display: "flex",
            cursor: "pointer",
          };
          if (showThumbnail?.thumbCss && showThumbnail.selectedThumbCss) {
            if (pageNum === pageNo) {
              thumbnailCss = showThumbnail.selectedThumbCss;
            } else {
              thumbnailCss = showThumbnail.thumbCss;
            }
          } else {
            if (pageNum === pageNo) {
              thumbnailStyle.margin = "10px 20px";
              thumbnailStyle.border = "5px solid rgba(58, 58, 64, 1)";
              thumbnailStyle.boxShadow =
                "rgba(0, 0, 0, 0.6) 0 4px 8px 0, rgba(0, 0, 0, 0.58) 0 6px 20px 0";
            } else {
              thumbnailStyle.margin = "15px 25px";
              thumbnailStyle.boxShadow = "rgba(0, 0, 0, 0.6) 0px 2px 2px 0px";
            }
          }

          thumbnailList.push(
            <img
              style={thumbnailStyle}
              className={thumbnailCss}
              onClick={() => changePage?.(pageNo)}
              ref={pageNum === pageNo ? selectedRef : null}
              key={pageNo}
              alt={`thumbnail of page ${pageNo}`}
              src={image}
            />
          );
        }
        // insert space at the end of all pages
        thumbnailList.push(<div key={0} style={{ padding: "0px 10px" }}></div>);
        setThumbnails(thumbnailList);
      }
    },
    [changePage, pageNum, showThumbnail]
  );

  const scrollThumbnail = () => {
    // scroll selected thumbnail into view
    if (
      selectedRef.current !== null &&
      Object.entries(showThumbnail || {}).length !== 0
    ) {
      selectedRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  const fetchPDF = useCallback(async () => {
    // Get PDF file
    let pdfDoc: PDFDocumentProxy | null = null;
    let thumbImages: PDFImage[] = [];
    try {
      console.log("pdfjs", pdfjs);
      pdfDoc = await pdfjs.getDocument(
        document.url || atob(document.base64 || "")
      ).promise;
      thumbImages = (await createImages(pdfDoc)) || [];

      displayThumbnails(thumbImages);

      setPDF(pdfDoc);
      setThumbnailImages(thumbImages);

      await displayPage(pdfDoc);
      // call pageCountfunction to update page count
      pageCount?.(pdfDoc?.numPages || 0);
    } catch (error) {
      console.warn("Error while opening the document !\n", error);
      pageCount?.(-1); // set page count to -1 on error
      setError({
        status: true,
        message: "Error while opening the document !",
      });
    }
  }, [
    createImages,
    displayPage,
    displayThumbnails,
    document.base64,
    document.url,
    pageCount,
  ]);

  useEffect(() => {
    fetchPDF();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [document, password, pageNum, scale, rotation]);

  useEffect(() => {
    displayThumbnails(thumbnailImages);
    scrollThumbnail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNum]);

  if (Object.entries(showThumbnail || {}).length !== 0) {
    let thumbContainerStyle: CSSProperties = {
      backgroundColor: showThumbnail?.backgroundColor
        ? showThumbnail.backgroundColor
        : "#EAE6DA",
      display: "flex",
      flexDirection: "row",
      overflowX: "auto",
    };

    if (showThumbnail?.onTop) {
      return (
        <>
          <div
            className={canvasCss ? canvasCss : ""}
            style={
              canvasCss
                ? {}
                : {
                    height: "1000px",
                    overflow: "auto",
                  }
            }
          >
            <div style={thumbContainerStyle}>{thumbnails}</div>
            <div
              style={error.status ? { display: "block" } : { display: "none" }}
            >
              <div className="text-error">{error.message}</div>
            </div>
            <canvas
              style={error.status ? { display: "none" } : undefined}
              onContextMenu={(e) =>
                protectContent ? e.preventDefault() : null
              }
              ref={canvasRef}
              width={
                (typeof window !== "undefined" && window.innerWidth) ||
                undefined
              }
              height={
                (typeof window !== "undefined" && window.innerHeight) ||
                undefined
              }
            />
          </div>

          <canvas ref={thumbnailRef} style={{ display: "none" }} />
        </>
      );
    } else {
      return (
        <>
          <div
            className={canvasCss ? canvasCss : ""}
            style={
              canvasCss
                ? {}
                : {
                    height: "1000px",
                    overflow: "auto",
                  }
            }
          >
            <div
              style={error.status ? { display: "block" } : { display: "none" }}
            >
              <div className="text-error">{error.message}</div>
            </div>
            <canvas
              style={error.status ? { display: "none" } : undefined}
              onContextMenu={(e) =>
                protectContent ? e.preventDefault() : null
              }
              ref={canvasRef}
              width={
                (typeof window !== "undefined" && window.innerWidth) ||
                undefined
              }
              height={
                (typeof window !== "undefined" && window.innerHeight) ||
                undefined
              }
            />
          </div>
          <div style={thumbContainerStyle}>{thumbnails}</div>
          <canvas ref={thumbnailRef} style={{ display: "none" }} />
        </>
      );
    }
  } else {
    return (
      <div>
        <div
          className={canvasCss ? canvasCss : ""}
          style={
            canvasCss
              ? {}
              : {
                  height: "1000px",
                  overflow: "auto",
                }
          }
        >
          <div
            style={error.status ? { display: "block" } : { display: "none" }}
          >
            <div className="text-error">{error.message}</div>
          </div>
          <canvas
            style={error.status ? { display: "none" } : undefined}
            onContextMenu={(e) => (protectContent ? e.preventDefault() : null)}
            ref={canvasRef}
            width={
              (typeof window !== "undefined" && window.innerWidth) || undefined
            }
            height={
              (typeof window !== "undefined" && window.innerHeight) || undefined
            }
          />
        </div>
      </div>
    );
  }
};

export default PdfViewer;
