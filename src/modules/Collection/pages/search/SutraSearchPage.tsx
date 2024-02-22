import type { FC } from "react";
import CollectionBreadcrumb from "../../components/CollectionBreadcrumb";

interface SutraSearchPageProps {}

const SutraSearchPage: FC<SutraSearchPageProps> = ({}) => {
  return (
    <>
      <div className="flex justify-between p-5">
        <CollectionBreadcrumb />
        <div></div>
      </div>
      <hr />
      <div>SutraSearchPage</div>
    </>
  );
};

export default SutraSearchPage;
