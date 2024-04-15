import { useRouter } from "next/router";
import type { Page as PageType } from "src/types/page";
import PdfViewer from "src/modules/PdfViewer";
import { useState } from "react";

const Page: PageType = () => {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [page, setPage] = useState(1);

  return (
    <>
      <button
        onClick={() =>
          setUrl(
            "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf"
          )
        }
      >
        click
      </button>
      {url && (
        <PdfViewer
          doc={{
            url,
            // url: "http://localhost:3000/pdf/test.pdf",
            // url: "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf",
          }}
          showThumbnail={{ scale: 0.5 }}
          pageNum={page}
          changePage={setPage}
          scale={1}
          rotation={0}
        ></PdfViewer>
      )}
    </>
  );
};

export default Page;
