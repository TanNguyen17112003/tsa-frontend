import type { FC } from "react";
import CollectionBreadcrumb from "../../../CollectionBreadcrumb";

interface SutraExplorePageProps {}

const SutraExplorePage: FC<SutraExplorePageProps> = ({}) => {
  return (
    <>
      <div className="flex justify-between p-5">
        <CollectionBreadcrumb />
        <div></div>
      </div>
      <div>SutraExplorePage</div>
    </>
  );
};

export default SutraExplorePage;
