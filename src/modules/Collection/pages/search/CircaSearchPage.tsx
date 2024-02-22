import type { FC } from "react";
import CollectionBreadcrumb from "../../components/CollectionBreadcrumb";

interface CircaSearchPageProps {}

const CircaSearchPage: FC<CircaSearchPageProps> = ({}) => {
  return (
    <>
      <div className="flex justify-between p-5">
        <CollectionBreadcrumb />
        <div></div>
      </div>
      <hr />
      <div>CircaSearchPage</div>
    </>
  );
};

export default CircaSearchPage;
