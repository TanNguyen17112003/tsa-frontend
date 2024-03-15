import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { SutrasApi } from "src/api/sutras";
import { CustomTable } from "src/components/custom-table";
import { Button } from "src/components/shadcn/ui/button";
import { Input } from "src/components/shadcn/ui/input";
import FormInput from "src/components/ui/FormInput";
import useFunction from "src/hooks/use-function";
import getAuthorSearchTableConfig from "src/sections/admin/author-search/author-search-table-config";

const AuthorSearchForm = ({}: {}) => {
  const router = useRouter();
  const getSutrasApi = useFunction(SutrasApi.getSutras);
  const [searchData, setSearchData] = useState("");
  useEffect(() => {
    getSutrasApi.call({});
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

  const handleClick = (id: string) => {
    router.replace({
      pathname: router.pathname,
      query: { ...router.query, authorId: id },
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
        onClickRow={(row) => handleClick(row.author_id)}
      />
    </>
  );
};

export default AuthorSearchForm;
