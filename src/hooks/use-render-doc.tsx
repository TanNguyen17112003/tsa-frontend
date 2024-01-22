import { useCallback, useEffect, useRef } from "react";
import { urlToFile } from "src/utils/url-handler";

export const useRenderDoc = (
  file: string | File | Blob,
  data: { [name: string]: any },
  options?: {
    hide?: boolean;
    usePatch?: boolean;
    onFile?: (file: File | Blob | Uint8Array | undefined) => void;
  }
) => {
  const docTemplate = useRef<File | Blob | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleRenderDocx = useCallback(async () => {
    if (typeof window != undefined) {
      try {
        const docx = await import("docx-preview");

        if (!docTemplate.current && typeof file == "string" && file) {
          docTemplate.current = (await urlToFile(file)) || null;
        } else if (typeof file != "string") {
          docTemplate.current = file;
        }
        if (docTemplate.current) {
          let file: File | Blob | Uint8Array | undefined = undefined;
          if (options?.usePatch) {
            const { patchDocument } = await import("docx");
            file = await patchDocument(docTemplate.current, {
              keepOriginalStyles: true,
              patches: data,
            });
          } else {
            const { generateDocument } = await import("src/utils/docx-helper");
            file = await generateDocument(docTemplate.current, data);
          }
          options?.onFile?.(file);

          if (containerRef.current) {
            containerRef.current.style.backgroundColor = "white";
            const res = await docx.renderAsync(
              file,
              containerRef.current,
              undefined,
              {
                inWrapper: false,
                experimental: true,
                breakPages: true,
              }
            );
          }
        }
      } catch (error) {}
    }
  }, [data, file, options]);

  useEffect(() => {
    if (!options?.hide) {
      handleRenderDocx();
    }
  }, [handleRenderDocx, options?.hide]);

  return { containerRef };
};
