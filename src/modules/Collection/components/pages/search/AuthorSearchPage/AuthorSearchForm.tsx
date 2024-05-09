import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { SutrasApi } from "src/api/sutras";
import { CustomTable } from "src/components/custom-table";
import { Button } from "src/components/shadcn/ui/button";
import FormInput from "src/components/ui/FormInput";
import { useCollectionCategoriesContext } from "src/contexts/collections/collection-categories-context";
import useFunction from "src/hooks/use-function";
import getAuthorSearchTableConfig from "src/sections/admin/author-search/author-search-table-config";
import { SutraDetail, enrichSutra } from "src/types/sutra";

const AuthorSearchForm = () => {
  const router = useRouter();
  const getSutrasApi = useFunction(SutrasApi.getSutras);
  const [searchData, setSearchData] = useState("");
  const { categories, tree } = useCollectionCategoriesContext();

  useEffect(() => {
    getSutrasApi.call({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sutras = useMemo(() => {
    const result = (getSutrasApi.data || []).map((s) =>
      enrichSutra(s, tree, categories)
    );
    if (searchData.length != 0) {
      return result.filter((item) =>
        item.author.author.toLowerCase().includes(searchData.toLowerCase())
      );
    } else {
      return result;
    }
  }, [categories, getSutrasApi.data, tree, searchData]);

  const formik = useFormik({
    initialValues: { author: "" },
    onSubmit: (values) => {
      setSearchData(values.author);
    },
  });

  const handleClick = (row: SutraDetail) => {
    router.replace({
      pathname: router.pathname,
      query: {
        ...router.query,
        authorId: row.author_id,
      },
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
        rows={sutras}
        configs={getAuthorSearchTableConfig}
        onClickRow={(row) => handleClick(row)}
      />
    </>
  );
};

export default AuthorSearchForm;
