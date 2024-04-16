import React, { useState, useEffect, useRef, useCallback } from "react";
import { type RenderTask, type PDFDocumentProxy } from "pdfjs-dist";
import type PdfLib from "pdfjs-dist/types/src/pdf";
import Thumbnails from "./Thumbnails";
import clsx from "clsx";
import Pagination from "src/components/ui/Pagination";
import ControlWrapper from "./ControlWrapper";

interface PdfViewerProps {
  src: string | ArrayBuffer;
  password?: { url?: string; base64?: string };
  pageNum: number;
  scale: number;
  rotation: number;
  changePage?: (pageNumber: number) => void;
  showThumbnail?: {
    scale?: number;
  };
  protectContent?: boolean;
  canvasCss?: string;
}

const PdfViewer: React.FC<PdfViewerProps> = ({
  src,
  password,
  pageNum,
  scale,
  rotation,
  changePage,
  showThumbnail,
  protectContent,
  canvasCss,
}) => {
  const [pageCount, setPageCount] = useState(0);
  const [pdf, setPDF] = useState<PDFDocumentProxy | null>(null);
  const [thumbnailImages, setThumbnailImages] = useState<string[]>([]);
  const prevRenderTask = useRef<RenderTask | null>(null);
  const [error, setError] = useState({ status: false, message: "" });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const thumbnailRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const pdfJS = useRef<typeof PdfLib | null>(null);

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

      if (!wrapperRef.current) {
        console.log("no wrapper");
        return;
      }

      try {
        const page = await pdfDoc.getPage(pageNum);

        const viewport = page.getViewport({
          scale: scale,
          rotation,
        });

        // Prepare canvas using PDF page dimensions
        const canvas = canvasRef.current;
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        canvas.style.transform = `scale(${
          (wrapperRef.current.clientHeight - 16) / viewport.height
        })`;

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
        // cancel previous render task
        if (prevRenderTask.current != null) {
          prevRenderTask.current?.cancel();
        }
        const renderTask = page.render(renderContext);
        prevRenderTask.current = renderTask;

        try {
          await renderTask.promise;
          // const textContent = await page.getTextContent();
          // console.log("textContent", textContent);
          // const textLayer = document.getElementById("textLayer");
          // if (textLayer) {
          //   textLayer.style.left = canvas.offsetLeft + "px";
          //   textLayer.style.top = canvas.offsetTop + "px";
          //   textLayer.style.height = canvas.offsetHeight + "px";
          //   textLayer.style.width = canvas.offsetWidth + "px";
          //   // textLayer.style.transform = canvas.style.transform;

          //   // Pass the data to the method for rendering of text over the pdf canvas.
          //   pdfJS.current?.renderTextLayer({
          //     textContentSource: textContent,
          //     container: textLayer,
          //     viewport: viewport,
          //     textDivs: [],
          //   });
          // }
        } catch (error) {
          console.log("Error occured while rendering !\n", error);
          setError({
            status: true,
            message: "Error occured while rendering !",
          });
        }
      } catch (error) {
        console.log("Error while reading the pages !\n", error);
        setError({
          status: true,
          message: "Error while reading the pages !",
        });
      }
    },
    [pageNum, pdf, prevRenderTask, rotation, scale]
  );

  const createImages = useCallback(
    async (pdf: PDFDocumentProxy) => {
      // create images for all pages
      const imgList = [];
      console.log("createImages", pdf);
      if (Object.entries(showThumbnail || {}).length !== 0) {
        if (!thumbnailRef.current) {
          console.log("no thumb canvas");
          return;
        }

        let thumbnailScal = showThumbnail?.scale || 1;
        let scale = 0.25;
        let rotation = 0;
        if (1 <= thumbnailScal && thumbnailScal <= 5) {
          scale = thumbnailScal / 10;
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

  const fetchPDF = useCallback(async () => {
    // Get PDF file
    let pdfDoc: PDFDocumentProxy | null = null;
    try {
      if (!pdfJS.current) {
        const script = document.createElement("script");

        script.src = "/pdf/pdf.worker.min.mjs";
        script.async = true;
        script.type = "module";

        document.body.appendChild(script);
        pdfJS.current = await import("pdfjs-dist");
        pdfJS.current.GlobalWorkerOptions.workerSrc = "/pdf/pdf.worker.min.mjs";
      }

      const task = pdfJS.current.getDocument(src);
      pdfDoc = await task.promise;
      setPDF(pdfDoc);
      setPageCount(pdfDoc.numPages);
    } catch (error) {
      console.warn("Error while opening the document !\n", error);
      setError({
        status: true,
        message: "Error while opening the document !",
      });
    }
  }, [src]);

  const renderPDF = useCallback(async () => {
    try {
      if (!pdf) {
        throw "No pdf";
      }
      setError({ status: false, message: "" });

      await displayPage(pdf);
    } catch (error) {
      console.log("Error while render the document !\n", error);
      setError({
        status: true,
        message: "Error while render the document !",
      });
    }
  }, [displayPage, pdf]);

  useEffect(() => {
    if (src) {
      console.log("fetchPDF", fetchPDF);
      fetchPDF();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  useEffect(() => {
    if (pdf) {
      const getThumbs = async () => {
        const thumbImages = (await createImages(pdf)) || [];
        setThumbnailImages(thumbImages.map((image) => image.image));
      };
      getThumbs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdf]);

  useEffect(() => {
    if (pdf) {
      console.log("renderPDF", renderPDF);
      renderPDF();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdf, pageNum, scale, rotation]);

  return (
    <>
      <div className="flex bg-black/5 relative h-full">
        <div className="absolute top-0 left-0 p-3 w-[280px] h-full z-10">
          <Thumbnails
            images={thumbnailImages}
            className="h-full"
            symbol="a"
            onPageChange={changePage}
            selectedPage={pageNum}
          />
        </div>
        <div
          className={clsx(
            "absolute top-0 left-[260px]",
            error.status && "hidden"
          )}
        >
          <div className="text-error">{error.message}</div>
        </div>
        <div className="flex-1 ml-[280px] flex flex-col">
          <div
            className="flex-1 flex items-center justify-center z-0 overflow-hidden relative"
            ref={wrapperRef}
          >
            <ControlWrapper className="w-full h-full flex items-center justify-center">
              <canvas
                className={clsx(
                  "border rounded-md z-0",
                  error.status && "hidden"
                )}
                style={error.status ? { display: "none" } : undefined}
                onContextMenu={(e) =>
                  protectContent ? e.preventDefault() : null
                }
                ref={canvasRef}
              />
              <div id="textLayer" className="absolute"></div>
            </ControlWrapper>
          </div>

          <div
            className={clsx(
              "flex justify-end w-full left-0 relative z-40 gap-4 py-3 px-3 border-top"
            )}
          >
            <div></div>
            <Pagination
              page={pageNum - 1}
              count={pageCount}
              rowsPerPage={1}
              length={2}
              onChange={(_, page) => changePage?.(page + 1)}
            />
          </div>
        </div>
      </div>

      <canvas ref={thumbnailRef} className="hidden" />
    </>
  );
};

export default PdfViewer;
