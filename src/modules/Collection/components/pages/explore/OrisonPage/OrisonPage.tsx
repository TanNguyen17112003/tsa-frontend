import type { FC } from "react";
import CollectionBreadcrumb from "../../../CollectionBreadcrumb";

interface OrisonPageProps {}

const OrisonPage: FC<OrisonPageProps> = ({}) => {
  return (
    <>
      <div className="flex justify-between p-5">
        <CollectionBreadcrumb />
        <div></div>
      </div>
      <div>OrisonPage</div>
    </>
  );
};

export default OrisonPage;
