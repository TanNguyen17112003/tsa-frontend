import { FC, useEffect } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "src/components/shadcn/ui/tabs";
import CollectionBreadcrumb from "../../../CollectionBreadcrumb";
import AuthorSearchForm from "./AuthorSearchForm";
import TranslatorSearchForm from "./TranslatorSearchForm";
import { useRouter } from "next/router";

interface AuthorSearchPageProps {}

const AuthorSearchPage: FC<AuthorSearchPageProps> = ({}) => {
  const router = useRouter();

  useEffect(() => {
    router.replace({
      pathname: router.pathname,
      query: { searchType: "author" },
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex justify-between p-5">
        <CollectionBreadcrumb />
        <div></div>
      </div>
      <hr />
      <div className="p-6">
        <div className="max-w-[928px] mx-auto">
          <Tabs defaultValue="author">
            <TabsList>
              <TabsTrigger value="author">Tác giả</TabsTrigger>
              <TabsTrigger value="translator">Dịch giả</TabsTrigger>
            </TabsList>
            <hr className="-mt-1" />
            <TabsContent value="author">
              <AuthorSearchForm />
            </TabsContent>
            <TabsContent value="translator">
              <TranslatorSearchForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default AuthorSearchPage;
