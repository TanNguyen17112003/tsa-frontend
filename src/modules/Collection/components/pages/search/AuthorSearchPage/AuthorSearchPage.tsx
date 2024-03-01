import type { FC } from "react";
import { BsSearch } from "react-icons/bs";
import { Input } from "src/components/shadcn/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "src/components/shadcn/ui/tabs";
import CollectionBreadcrumb from "../../../CollectionBreadcrumb";

interface AuthorSearchPageProps {}

const AuthorSearchPage: FC<AuthorSearchPageProps> = ({}) => {
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
            <div className="flex border border-gray-300 rounded-md w-full items-center my-6">
              <Input
                type="text"
                placeholder="Tìm kiếm"
                className="border-none"
              />
              <BsSearch style={{ color: "gray" }} className="mx-2" />
            </div>
            <hr />
            <TabsContent value="author">
              Make changes to your account here.
            </TabsContent>
            <TabsContent value="translator">
              Change your password here.
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default AuthorSearchPage;
