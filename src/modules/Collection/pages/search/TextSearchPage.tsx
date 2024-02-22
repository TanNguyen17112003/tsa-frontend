import type { FC } from "react";
import CollectionBreadcrumb from "../../components/CollectionBreadcrumb";

interface TextSearchPageProps {}

const TextSearchPage: FC<TextSearchPageProps> = ({}) => {
  return (
    <>
      <div className="flex justify-between p-5">
        <CollectionBreadcrumb />
        <div></div>
      </div>
      <hr />
      <div>TextSearchPage</div>
    </>
  );
};

export default TextSearchPage;
