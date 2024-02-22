import type { FC } from "react";
import CollectionBreadcrumb from "../../components/CollectionBreadcrumb";

interface CollectionPageProps {}

const CollectionPage: FC<CollectionPageProps> = ({}) => {
  return (
    <>
      <div className="flex justify-between p-5">
        <CollectionBreadcrumb />
        <div></div>
      </div>
      <hr />
      <div>CollectionPage</div>
    </>
  );
};

export default CollectionPage;
