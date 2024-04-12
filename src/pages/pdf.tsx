import { useRouter } from "next/router";
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import PdfViewer from "src/modules/PdfViewer";
import type { Page as PageType } from "src/types/page";

const Page: PageType = () => {
  const router = useRouter();

  return (
    <PdfViewer
      document={{
        url: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
      }}
      pageNum={1}
      scale={1}
      rotation={0}
    ></PdfViewer>
  );
};

export default Page;
