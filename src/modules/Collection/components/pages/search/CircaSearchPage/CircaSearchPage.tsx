import { FC, useEffect, useState } from "react";
import CollectionBreadcrumb from "../../../CollectionBreadcrumb";
import CircaSearchForm, { CircaSearchQuery } from "./CircaSearchForm";
import CircaSearchResultPage from "./CircaSearchResultPage";
import { useRouter } from "next/router";

interface CircaSearchPageProps {}

const CircaSearchPage: FC<CircaSearchPageProps> = ({}) => {
  const router = useRouter();
  const [qCirca, setQCirca] = useState<CircaSearchQuery>();

  useEffect(() => {
    router.replace({
      pathname: router.pathname,
      query: "searchType=circa",
    });
  }, []);
  return (
    <>
      <div className="flex justify-between p-5">
        <CollectionBreadcrumb />
        <div></div>
      </div>
      <hr />
      <div className="p-6">
        <div className="max-w-[928px] mx-auto">
          <CircaSearchForm
            setQCirca={(values) => {
              setQCirca(values);
            }}
          />
          <CircaSearchResultPage qCirca={qCirca} />
        </div>
      </div>
    </>
  );
};

export default CircaSearchPage;
