import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { CustomTable } from "src/components/custom-table";
import { Button } from "src/components/shadcn/ui/button";
import { Input } from "src/components/shadcn/ui/input";
import FormInput from "src/components/ui/FormInput";
import { useSutrasContext } from "src/contexts/sutras/sutras-context";
import getTranslatorSearchTableConfig from "src/sections/admin/author-search/translator-search-table-config";
import { SutraDetail } from "src/types/sutra";

const TranslatorSearchForm = () => {
  const {getSutrasApi} = useSutrasContext();
  const router = useRouter();
  const [searchData, setSearchData] = useState("");

  useEffect(() => {
    getSutrasApi.call({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formik = useFormik({
    initialValues: { translator: "" },
    onSubmit: (values) => {
      setSearchData(values.translator);
    },
  });

  const data = useMemo(() => {
    if (searchData.length != 0) {
      return (
        getSutrasApi.data?.filter((item) =>
          item.translator.full_name.toLowerCase().includes(searchData.toLowerCase())
        ) || []
      );
    } else {
      return getSutrasApi.data || [];
    }
  }, [getSutrasApi, searchData]);

  const handleClick = (row: SutraDetail) => {
    router.replace({
      pathname: router.pathname,
      query: { ...router.query, translatorId: row.translator.id, translatorName: row.translator.full_name },
    });
  };

  return (
    <>
      <div className="flex border border-gray-300 rounded-md w-full items-center my-6">
        <FormInput
          label=""
          placeholder="Tìm kiếm"
          {...formik.getFieldProps("translator")}
          className="border-none"
        />
        <Button variant="link" onClick={() => formik.handleSubmit()}>
          <BsSearch style={{ color: "gray" }} className="mx-2" />
        </Button>
      </div>
      <hr />
      <CustomTable 
        rows={data} 
        configs={getTranslatorSearchTableConfig} 
        onClickRow={(row) => handleClick(row)}
      />
    </>
  );
};

export default TranslatorSearchForm;
