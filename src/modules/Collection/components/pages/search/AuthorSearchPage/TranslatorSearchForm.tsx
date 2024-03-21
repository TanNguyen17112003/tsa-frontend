import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { CustomTable } from "src/components/custom-table";
import { Button } from "src/components/shadcn/ui/button";
import FormInput from "src/components/ui/FormInput";
import { useCollectionCategoriesContext } from "src/contexts/collections/collection-categories-context";
import { useCollectionsContext } from "src/contexts/collections/collections-context";
import { useSutrasContext } from "src/contexts/sutras/sutras-context";
import getTranslatorSearchTableConfig from "src/sections/admin/author-search/translator-search-table-config";
import { SutraDetail } from "src/types/sutra";

const TranslatorSearchForm = () => {
  const { getSutrasApi } = useSutrasContext();
  const router = useRouter();
  const [searchData, setSearchData] = useState("");
  const { categories, tree } = useCollectionCategoriesContext();

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
        getSutrasApi.data?.filter(
          (item) =>
            item.user_id ==
            categories.translators?.find((category) =>
              category.full_name
                .toLowerCase()
                .includes(searchData.toLowerCase())
            )?.id
        ) || []
      );
    } else {
      return getSutrasApi.data || [];
    }
  }, [getSutrasApi, searchData]);

  const handleClick = (row: SutraDetail) => {
    router.replace({
      pathname: router.pathname,
      query: {
        ...router.query,
        translatorId: row.user_id,
      },
    });
  };

  const translatorSearchTableConfig = useMemo(() => {
    return getTranslatorSearchTableConfig({
      getCollection: (id: string) => {
        const collection = tree.collections.find((item) => item.id == id)?.name;
        return collection?.toString() || "";
      },
      getTranslator: (id: string) => {
        const translator = categories.translators?.find(
          (item) => item.id == id
        )?.full_name;
        return translator?.toString() || "";
      },
    });
  }, [tree, categories]);

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
        configs={translatorSearchTableConfig}
        onClickRow={(row) => handleClick(row)}
      />
    </>
  );
};

export default TranslatorSearchForm;
