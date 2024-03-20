import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { CollectionTreeResponse } from "src/api/collections";
import { SutrasApi } from "src/api/sutras";
import { CustomTable } from "src/components/custom-table";
import { Button } from "src/components/shadcn/ui/button";
import FormInput from "src/components/ui/FormInput";
import { useCollectionCategoriesContext } from "src/contexts/collections/collection-categories-context";
import { useCollectionsContext } from "src/contexts/collections/collections-context";
import useFunction from "src/hooks/use-function";
import getAuthorSearchTableConfig from "src/sections/admin/author-search/author-search-table-config";
import { Orison } from "src/types/orison";
import { SutraDetail } from "src/types/sutra";

const AuthorSearchForm = () => {
  const router = useRouter();
  const getSutrasApi = useFunction(SutrasApi.getSutras);
  const [searchData, setSearchData] = useState("");

  const { getCollectionsApi } = useCollectionsContext();
  const { categories, tree } = useCollectionCategoriesContext();

  useEffect(() => {
    getSutrasApi.call({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const data = useMemo(() => {
    return getSutrasApi.data || [];
  }, [getSutrasApi.data]);

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
                    sutra.author_id ==
                    categories.authors.find(
                      (author) =>
                        author.author
                          .toLowerCase()
                          .includes(searchData.toLowerCase()) &&
                        author.id == sutra.author_id
                    )?.id
                )?.id
            )?.id
        ) || []
      );
    } else {
      return tree.orisons;
    }
  }, [getSutrasApi.data, searchData]);

  const formik = useFormik({
    initialValues: { author: "" },
    onSubmit: (values) => {
      setSearchData(values.author);
    },
  });

  const handleClick = (row: Orison) => {
    const idSutra =
      tree.sutras.find(
        (item) =>
          item.id ==
          tree.volumes.find((volume) => volume.id == row.volume_id)?.sutras_id
      )?.id || "";
    const authorId = data.find((item) => item.id == idSutra)?.author_id || "";
    router.replace({
      pathname: router.pathname,
      query: {
        ...router.query,
        authorId: authorId,
      },
    });
  };

  const authorSearchTableConfig = useMemo(() => {
    return getAuthorSearchTableConfig({
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
      getAuthor: (volumeId: string) => {
        const idSutra =
          tree.sutras.find(
            (item) =>
              item.id ==
              tree.volumes.find((volume) => volume.id == volumeId)?.sutras_id
          )?.id || "";
        const authorId =
          data.find((item) => item.id == idSutra)?.author_id || "";
        const author = categories.authors?.find(
          (item) => item.id == authorId
        )?.author;
        return author?.toString() || "";
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
          {...formik.getFieldProps("author")}
          className="border-none"
        />
        <Button variant="link" onClick={() => formik.handleSubmit()}>
          <BsSearch style={{ color: "gray" }} className="mx-2" />
        </Button>
      </div>
      <hr />
      <CustomTable
        rows={orison}
        configs={authorSearchTableConfig}
        onClickRow={(row) => handleClick(row)}
      />
    </>
  );
};

export default AuthorSearchForm;
