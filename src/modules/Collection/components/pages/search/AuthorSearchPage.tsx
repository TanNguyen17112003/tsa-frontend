import type { FC } from "react";
import CollectionBreadcrumb from "../../CollectionBreadcrumb";

interface AuthorSearchPageProps {}

const AuthorSearchPage: FC<AuthorSearchPageProps> = ({}) => {
  return (
    <>
      <div className="flex justify-between p-5">
        <CollectionBreadcrumb />
        <div></div>
      </div>
      <hr />
      <div>AuthorSearchPage</div>
    </>
  );
};

export default AuthorSearchPage;
