import type { FC } from "react";
import CollectionBreadcrumb from "../../../CollectionBreadcrumb";

interface VolumnExplorePageProps {}

const VolumnExplorePage: FC<VolumnExplorePageProps> = ({}) => {
  return (
    <>
      <div className="flex justify-between p-5">
        <CollectionBreadcrumb />
        <div></div>
      </div>
      <div>VolumnExplorePage</div>
    </>
  );
};

export default VolumnExplorePage;
