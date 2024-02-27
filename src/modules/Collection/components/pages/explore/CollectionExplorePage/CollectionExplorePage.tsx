import type { FC } from "react";
import CollectionBreadcrumb from "../../../CollectionBreadcrumb";

interface CollectionExplorePageProps {}

const CollectionExplorePage: FC<CollectionExplorePageProps> = ({}) => {
  return (
    <>
      <div className="flex justify-between p-5">
        <CollectionBreadcrumb />
        <div></div>
      </div>
      <div>CollectionExplorePage</div>
    </>
  );
};

export default CollectionExplorePage;
