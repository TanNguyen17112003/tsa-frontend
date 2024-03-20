import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect, type FC, useMemo, useState, useCallback } from "react";
import { Button } from "src/components/shadcn/ui/button";
import CollectionBreadcrumb from "../../../CollectionBreadcrumb";
import { CustomTable } from "src/components/custom-table";
import getAuthorSearchResultTableConfig from "src/sections/admin/author-search/author-search-result-table-config";
import { useSutrasContext } from "src/contexts/sutras/sutras-context";
import { useCollectionCategoriesContext } from "src/contexts/collections/collection-categories-context";
import { useSelection } from "src/hooks/use-selection";
import { Sutra } from "src/types/sutra";
import useFunction from "src/hooks/use-function";
import { OrisonsApi } from "src/api/orisons";
import { format } from "date-fns";
import { Orison, OrisonDetail } from "src/types/orison";
import { getFormData } from "src/utils/api-request";

interface AuthorSearchFormProps {
  qAuthorId: string;
}

export interface AuthorSearchQuery {
  qAuthorId: string;
}

const initialAuthorSearchQuery: AuthorSearchQuery = {
  qAuthorId: "",
};

const AuthorSearchResultPage: FC<AuthorSearchFormProps> = ({
  qAuthorId,
}: {
  qAuthorId: string;
}) => {
  const router = useRouter();
  const getOrisonsApi = useFunction(OrisonsApi.getOrisons);
  const { getSutrasApi } = useSutrasContext();
  const { categories, tree } = useCollectionCategoriesContext();

  const formik = useFormik({
    initialValues: initialAuthorSearchQuery,
    onSubmit: (values) => {
      router.replace({
        pathname: router.pathname,
        query: { ...router.query, ...values },
      });
    },
  });

  useEffect(() => {
    if (router.query) {
      formik.setValues(router.query as unknown as AuthorSearchQuery);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  const handleBackToAuthorSearch = () => {
    router.replace({
      pathname: router.pathname,
      query: { searchType: "author" },
    });
  };

  useEffect(() => {
    getSutrasApi.call({});
    getOrisonsApi.call({ volume_id: "" });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sutras = useMemo(() => {
    return getSutrasApi.data || [];
  }, [getSutrasApi.data, qAuthorId]);

  const orison = useMemo(() => {
    return (
      getOrisonsApi.data?.filter(
        (item) =>
          item.volume_id ==
          tree.volumes.find(
            (volume) =>
              volume.sutras_id ==
              sutras.find((sutra) => sutra.author_id == qAuthorId)?.id
          )?.id
      ) || []
    );
  }, [getOrisonsApi.data, qAuthorId]);

  const AuthorSearchTableConfig = useMemo(() => {
    return getAuthorSearchResultTableConfig({
      onClickEdit: (data) => {},
      getVolume: (volumeId: string) => {
        const volumeCode =
          tree.volumes.find((item) => item.id == volumeId)?.name || "";
        return volumeCode.toString();
      },
      getAuthor: (volumeId: string) => {
        const idSutra =
          tree.sutras.find(
            (item) =>
              item.id ==
              tree.volumes.find((volume) => volume.id == volumeId)?.sutras_id
          )?.id || "";
        const authorId =
          sutras.find((item) => item.id == idSutra)?.author_id || "";
        const author = categories.authors?.find(
          (item) => item.id == authorId
        )?.author;
        return author?.toString() || "";
      },
      getTranslator: (volumeId: string) => {
        const idSutra =
          tree.sutras.find(
            (item) =>
              item.id ==
              tree.volumes.find((volume) => volume.id == volumeId)?.sutras_id
          )?.id || "";
        const translatorId =
          sutras.find((item) => item.id == idSutra)?.user_id || "";
        const translator = categories.translators?.find(
          (item) => item.id == translatorId
        )?.full_name;
        return translator?.toString() || "";
      },
      getCirca: (volumeId: string) => {
        const idSutra =
          tree.sutras.find(
            (item) =>
              item.id ==
              tree.volumes.find((volume) => volume.id == volumeId)?.sutras_id
          )?.id || "";
        const circa =
          sutras.find((item) => item.id == idSutra)?.circa.start_year +
          " TCN - " +
          sutras.find((item) => item.id == idSutra)?.circa.start_year +
          " TCN";
        return circa;
      },
    });
  }, [categories, tree, sutras]);

  const handleClickRow = useCallback(
    (row: Orison) => {
      router.replace({
        pathname: router.pathname,
        query: { orisonId: row.id },
      });
    },
    [router]
  );

  // const select = useSelection<Sutra>(sutras);

  return (
    <div>
      <div className="flex justify-between p-5">
        <CollectionBreadcrumb />
        <Button variant="outline" onClick={handleBackToAuthorSearch}>
          Tìm kiếm kết quả khác
        </Button>
      </div>
      <CustomTable
        rows={orison}
        configs={AuthorSearchTableConfig}
        // select={select}
        onClickRow={handleClickRow}
      />
    </div>
  );
};

export default AuthorSearchResultPage;
