import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { CustomTable } from "src/components/custom-table";
import { Button } from "src/components/shadcn/ui/button";
import { Input } from "src/components/shadcn/ui/input";
import FormInput from "src/components/ui/FormInput";
import { useCollectionCategoriesContext } from "src/contexts/collections/collection-categories-context";
import { useCollectionsContext } from "src/contexts/collections/collections-context";
import { useSutrasContext } from "src/contexts/sutras/sutras-context";
import getTranslatorSearchTableConfig from "src/sections/admin/author-search/translator-search-table-config";
import { Orison } from "src/types/orison";
import { SutraDetail } from "src/types/sutra";

const TranslatorSearchForm = () => {
  const { getSutrasApi } = useSutrasContext();
  const router = useRouter();
  const [searchData, setSearchData] = useState("");

  const { getCollectionsApi } = useCollectionsContext();
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
    return getSutrasApi.data || [];
  }, [getSutrasApi]);

  const orison = useMemo(() => {
    if (searchData.length != 0) {
      return (
        tree.orisons.filter(
          (item) =>
            item.volume_id ==
            tree.volumes.find(
              (volume) =>
                volume.sutras_id ==
                data.find(
                  (sutra) =>
                    sutra.user_id ==
                    categories.translators.find(
                      (translator) =>
                        translator.full_name
                          .toLowerCase()
                          .includes(searchData.toLowerCase()) &&
                        translator.id == sutra.user_id
                    )?.id
                )?.id
            )?.id
        ) || []
      );
    } else {
      return tree.orisons;
    }
  }, [getSutrasApi.data, searchData]);

  const handleClick = (row: Orison) => {
    const idSutra =
      tree.sutras.find(
        (item) =>
          item.id ==
          tree.volumes.find((volume) => volume.id == row.volume_id)?.sutras_id
      )?.id || "";
    const translatorId = data.find((item) => item.id == idSutra)?.user_id || "";
    router.replace({
      pathname: router.pathname,
      query: {
        ...router.query,
        translatorId: translatorId,
      },
    });
  };

  const translatorSearchTableConfig = useMemo(() => {
    return getTranslatorSearchTableConfig({
      getCollection: (volumeId: string) => {
        const collectionId =
          tree.collections.find(
            (item) =>
              item.id ==
              tree.sutras.find(
                (sutra) =>
                  sutra.id ==
                  tree.volumes.find((volume) => volume.id == volumeId)
                    ?.sutras_id
              )?.collection_id
          )?.id || "";
        const collection = getCollectionsApi.data?.find(
          (item) => item.id == collectionId
        )?.name;
        return collection?.toString() || "";
      },
      getTranslator: (volumeId: string) => {
        const idSutra =
          tree.sutras.find(
            (item) =>
              item.id ==
              tree.volumes.find((volume) => volume.id == volumeId)?.sutras_id
          )?.id || "";
        const translatorId =
          data.find((item) => item.id == idSutra)?.user_id || "";
        const translator = categories.translators?.find(
          (item) => item.id == translatorId
        )?.full_name;
        return translator?.toString() || "";
      },
      getSutra: (volumeId: string) => {
        const sutra =
          data.find(
            (item) =>
              item.id ==
              tree.volumes.find((volume) => volume.id == volumeId)?.sutras_id
          )?.name || "";
        return sutra.toString();
      },
    });
  }, [data, tree, categories]);

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
        rows={orison}
        configs={translatorSearchTableConfig}
        onClickRow={(row) => handleClick(row)}
      />
    </>
  );
};

export default TranslatorSearchForm;
