import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect, type FC, useMemo } from "react";
import { Button } from "src/components/shadcn/ui/button";
import CollectionBreadcrumb from "../../../CollectionBreadcrumb";
import { CustomTable } from "src/components/custom-table";
import { useSutrasContext } from "src/contexts/sutras/sutras-context";
import getTranslatorSearchResultTableConfig from "src/sections/admin/author-search/translator-search-result-table-config";

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
      query: {searchType:"author"},
    });
  };

  const {getSutrasApi} = useSutrasContext();

  useEffect(() => {
    getSutrasApi.call({});

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sutras = useMemo(() => {
    return (
      getSutrasApi.data?.filter((item) => item.translator.id == qTranslatorId) || []
    );
  }, [getSutrasApi.data, qTranslatorId]);

  console.log("object", getSutrasApi.data);

  const TranslatorSearchTableConfig = useMemo(() => {
    return getTranslatorSearchResultTableConfig({
      onClickEdit: (data) => {},
    });
  }, []);

  return (
    <div>
      <div className="flex justify-between p-5">
        <CollectionBreadcrumb />
        <Button variant="outline" onClick={handleBackToAuthorSearch}>
          Tìm kiếm kết quả khác
        </Button>
      </div>
      <CustomTable
        rows={sutras}
        configs={TranslatorSearchTableConfig}
      />
    </div>
  );
};

export default TranslatorSearchResultPage;
