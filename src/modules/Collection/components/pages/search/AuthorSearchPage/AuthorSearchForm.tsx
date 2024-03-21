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
import { SutraDetail } from "src/types/sutra";

const AuthorSearchForm = () => {
  const router = useRouter();
  const getSutrasApi = useFunction(SutrasApi.getSutras);
  const [searchData, setSearchData] = useState("");
  const { categories, tree } = useCollectionCategoriesContext();

  useEffect(() => {
    getSutrasApi.call({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const data = useMemo(() => {
    if (searchData.length != 0) {
      return (
        getSutrasApi.data?.filter(
          (item) =>
            item.author_id ==
            categories.authors?.find((category) =>
              category.author.toLowerCase().includes(searchData.toLowerCase())
            )?.id
        ) || []
      );
    } else {
      return getSutrasApi.data || [];
    }
  }, [getSutrasApi.data, searchData]);

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

  const authorSearchTableConfig = useMemo(() => {
    return getAuthorSearchTableConfig({
      getCollection: (id: string) => {
        const collection = tree.collections.find((item) => item.id == id)?.name;
        return collection?.toString() || "";
      },
      getAuthor: (id: string) => {
        const author = categories.authors?.find(
          (item) => item.id == id
        )?.author;
        return author?.toString() || "";
      },
    });
  }, [tree, categories]);

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
        configs={authorSearchTableConfig}
        onClickRow={(row) => handleClick(row)}
      />
    </>
  );
};

export default AuthorSearchForm;
