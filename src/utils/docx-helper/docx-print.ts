export const printDoc = async (
  files: (File | Blob | undefined)[],
  opts?: {
    size: string;
    waitToLoad?: number;
    margin?: string;
    pageStyle?: string;
  }
) => {
  var myframe = document.createElement("IFRAME") as HTMLIFrameElement;
  myframe.style.position = "absolute";
  myframe.style.padding = "4px";
  myframe.style.paddingTop = "64px";
  myframe.style.top = "0000px";
  myframe.style.zIndex = "100000";
  document.body.appendChild(myframe);
  const docxContainers = files.map((_) => {
    const docxContainer = document.createElement("div");
    docxContainer.style.position = "absolute";
    docxContainer.style.top = "-10000px";
    document.body.appendChild(docxContainer);
    return docxContainer;
  });

  document.body.appendChild(myframe);

  const docx = await import("docx-preview");
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file) {
      await new Promise((resolve) => {
        docx
          .renderAsync(file, docxContainers[i], undefined, {
            inWrapper: false,
            experimental: true,
            ignoreHeight: true,
          })
          .then(
            () => {
              setTimeout(
                function () {
                  myframe.focus();
                  myframe.contentDocument?.write(`<style>
            @media print {
              @page {
                margin: ${opts?.margin || "0"};
                size: ${opts?.size || "A4 portrait"};
              }
              .pagebreak {
                clear: both;
                page-break-after: always;
                break-after: always;
                margin: 0 !important; 
                padding: 0 !important;
                overflow: hidden;
              }
            }
           
          </style>`);
                  myframe.contentDocument?.write(
                    `<div class="pagebreak" style="${opts?.pageStyle || ""}">`
                  );
                  myframe.contentDocument?.write(docxContainers[i].innerHTML);
                  myframe.contentDocument?.write(`</div>`);
                  resolve("");
                },
                i == 0 ? opts?.waitToLoad || 0 : 0
              ); // wait for images to load inside iframe
            },
            () => {
              resolve("");
            }
          );
      });
    }
  }
  myframe.contentWindow?.print();
  window.focus();

  myframe.parentNode?.removeChild(myframe); // remove frame
  docxContainers.forEach((docxContainer) => {
    docxContainer.remove();
  });
};
