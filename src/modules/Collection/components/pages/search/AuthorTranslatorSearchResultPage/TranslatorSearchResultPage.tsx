import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect, type FC, useMemo, useState, useCallback } from "react";
import { Button } from "src/components/shadcn/ui/button";
import CollectionBreadcrumb from "../../../CollectionBreadcrumb";
import { CustomTable } from "src/components/custom-table";
import { useSutrasContext } from "src/contexts/sutras/sutras-context";
import { useCollectionCategoriesContext } from "src/contexts/collections/collection-categories-context";
import getAuthorSearchResultTableConfig from "src/sections/admin/author-search/author-search-result-table-config";
import { SutraDetail, enrichSutra } from "src/types/sutra";

interface TranslatorSearchFormProps {
  qTranslatorId: string;
}

export interface TranslatorSearchQuery {
  qTranslatorId: string;
}

const initialTranslatorSearchQuery: TranslatorSearchQuery = {
  qTranslatorId: "",
};

const TranslatorSearchResultPage: FC<TranslatorSearchFormProps> = ({
  qTranslatorId,
}: {
  qTranslatorId: string;
}) => {
  const router = useRouter();
  const { getSutrasApi } = useSutrasContext();
  const { categories, tree } = useCollectionCategoriesContext();

  const sutras = useMemo(() => {
    return (getSutrasApi.data || [])
      .filter((item) => item.user_id == qTranslatorId)
      .map((s) => enrichSutra(s, tree, categories));
  }, [categories, getSutrasApi.data, tree, qTranslatorId]);

  const formik = useFormik({
    initialValues: initialTranslatorSearchQuery,
    onSubmit: (values) => {
      router.replace({
        pathname: router.pathname,
        query: { ...router.query, ...values },
      });
    },
  });

  useEffect(() => {
    if (router.query) {
      formik.setValues(router.query as unknown as TranslatorSearchQuery);
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const TranslatorSearchTableConfig = useMemo(() => {
    return getAuthorSearchResultTableConfig({
      onClickEdit: (data) => {},
    });
  }, []);

  const handleClickRow = useCallback(
    (row: SutraDetail) => {
      const volumeId = tree.volumes.find(
        (item) => item.sutras_id == row.id
      )?.id;
      const orisonsId = tree.orisons.find(
        (item) => item.volume_id == volumeId
      )?.id;
      router.replace({
        pathname: router.pathname,
        query: { orisonId: orisonsId },
      });
    },
    [router, tree.orisons, tree.volumes]
  );

  // const select = useSelection<Sutra>(sutras);

  return (
    <div className="px-4">
      <div className="flex justify-between p-5">
        <CollectionBreadcrumb />
        <Button variant="outline" onClick={handleBackToAuthorSearch}>
          Tìm kiếm kết quả khác
        </Button>
      </div>
      <div className="p-4">
        <CustomTable
          rows={sutras}
          configs={TranslatorSearchTableConfig}
          onClickRow={handleClickRow}
          // select={select}
        />
      </div>
    </div>
  );
};

export default TranslatorSearchResultPage;
