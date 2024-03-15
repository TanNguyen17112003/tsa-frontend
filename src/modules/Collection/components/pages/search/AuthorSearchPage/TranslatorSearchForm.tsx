import { useEffect, useMemo } from "react";
import { BsSearch } from "react-icons/bs";
import { SutrasApi } from "src/api/sutras";
import { CustomTable } from "src/components/custom-table";
import { Input } from "src/components/shadcn/ui/input";
import useFunction from "src/hooks/use-function";
import getTranslatorSearchTableConfig from "src/sections/admin/author-search/translator-search-table-config";

const TranslatorSearchForm = ({}: {}) => {
  const getSutrasApi = useFunction(SutrasApi.getSutras);
  useEffect(() => {
    getSutrasApi.call({});
  }, []);
  const data = useMemo(() => {
    return getSutrasApi.data || [];
  }, [getSutrasApi]);

  return (
    <>
      <div className="flex border border-gray-300 rounded-md w-full items-center my-6">
        <Input type="text" placeholder="Tìm kiếm" className="border-none" />
        <BsSearch style={{ color: "gray" }} className="mx-2" />
      </div>
      <hr />
      <CustomTable rows={data} configs={getTranslatorSearchTableConfig} />
    </>
  );
};

export default TranslatorSearchForm;
