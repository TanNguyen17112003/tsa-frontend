import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect, type FC, useMemo, useCallback } from "react";
import { Button } from "src/components/shadcn/ui/button";
import CollectionBreadcrumb from "../../../CollectionBreadcrumb";
import { CustomTable } from "src/components/custom-table";
import getAuthorSearchResultTableConfig from "src/sections/admin/author-search/author-search-result-table-config";
import { useSutrasContext } from "src/contexts/sutras/sutras-context";
import { useCollectionCategoriesContext } from "src/contexts/collections/collection-categories-context";
import { SutraDetail, enrichSutra } from "src/types/sutra";

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sutras = useMemo(() => {
    return (getSutrasApi.data || [])
      .filter((item) => item.author_id == qAuthorId)
      .map((s) => enrichSutra(s, tree, categories));
  }, [categories, getSutrasApi.data, tree, qAuthorId]);

  const AuthorSearchTableConfig = useMemo(() => {
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
          configs={AuthorSearchTableConfig}
          // select={select}
          onClickRow={handleClickRow}
        />
      </div>
    </div>
  );
};

export default AuthorSearchResultPage;
