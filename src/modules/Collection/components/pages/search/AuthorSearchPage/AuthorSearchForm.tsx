import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { SutrasApi } from "src/api/sutras";
import { CustomTable } from "src/components/custom-table";
import { Button } from "src/components/shadcn/ui/button";
import FormInput from "src/components/ui/FormInput";
import useFunction from "src/hooks/use-function";
import getAuthorSearchTableConfig from "src/sections/admin/author-search/author-search-table-config";
import { SutraDetail } from "src/types/sutra";

const AuthorSearchForm = () => {
  const router = useRouter();
  const getSutrasApi = useFunction(SutrasApi.getSutras);
  const [searchData, setSearchData] = useState("");
  useEffect(() => {
    getSutrasApi.call({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const data = useMemo(() => {
    if (searchData.length != 0) {
      return (
        getSutrasApi.data?.filter((item) =>
          item.author.author.toLowerCase().includes(searchData.toLowerCase())
        ) || []
      );
    } else {
      return getSutrasApi.data || [];
    }
  }, [getSutrasApi, searchData]);
  const formik = useFormik({
    initialValues: { author: "" },
    onSubmit: (values) => {
      setSearchData(values.author);
    },
  });

  const handleClick = (row: SutraDetail) => {
    router.replace({
      pathname: router.pathname,
      query: { ...router.query, authorId: row.author_id, authorName: row.author.author },
    });
  };

  return (
    <>
      <div className="flex border border-gray-300 rounded-md w-full items-center my-6">
        <FormInput
          label=""
          placeholder="Tìm kiếm"
          {...formik.getFieldProps("author")}
          className="border-none"
        />
        <Button variant="link" onClick={() => formik.handleSubmit()}>
          <BsSearch style={{ color: "gray" }} className="mx-2" />
        </Button>
      </div>
      <hr />
      <CustomTable
        rows={data}
        configs={getAuthorSearchTableConfig}
        onClickRow={(row) => handleClick(row)}
      />
    </>
  );
};

export default AuthorSearchForm;
