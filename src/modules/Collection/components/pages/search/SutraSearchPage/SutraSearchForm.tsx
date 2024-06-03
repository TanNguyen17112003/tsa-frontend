import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect, type FC, useMemo } from "react";
import CustomSelect from "src/components/CustomSelect/CustomSelect";
import { Button } from "src/components/shadcn/ui/button";
import FormInput from "src/components/ui/FormInput";
import { useCollectionsContext } from "src/contexts/collections/collections-context";


interface SutraSearchFormProps {
  className?: string;
}

interface SutraSearchQuery {
  qCollectionId: string;
  qSutraId: string;
  qPageNumber: string;
  qChapter: string;
  qPagePath: string;
  qLine: string;
}

const initialSutraSearchQuery: SutraSearchQuery = {
  qCollectionId: "",
  qSutraId: "",
  qPageNumber: "",
  qChapter: "",
  qPagePath: "",
  qLine: "",
};

const SutraSearchForm: FC<SutraSearchFormProps> = ({ className }) => {
  const router = useRouter();
  const { getCollectionsApi } = useCollectionsContext();
  const collections = useMemo(() => {
    return getCollectionsApi.data || [];
  }, [getCollectionsApi.data]) 
  const formik = useFormik({
    initialValues: initialSutraSearchQuery,
    onSubmit: (values) => {
      router.replace({
        pathname: router.pathname,
        query: { ...router.query, ...values },
      });
    },
  });

  useEffect(() => {
    if (router.query) {
      formik.setValues(router.query as unknown as SutraSearchQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  return (
    <form className={className} onSubmit={formik.handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <CustomSelect
            options={collections.map((c) => ({
              value: c.id,
              label: c.name,
            }))
            }
            label="Tuyển tập"
            onValueChange={(value) =>
              formik.setFieldValue("qCollectionId", value)
            }
            placeholder="Chọn tuyển tập"
          />
        </div>
        <div>
          <FormInput
            label="Mã văn bản"
            placeholder="Nhập mã văn bản"
            {...formik.getFieldProps("qTextId")}
          />
        </div>
        <div>
          <FormInput
            label="Số trang"
            placeholder="Nhập số trang"
            {...formik.getFieldProps("qPageNumber")}
          />
        </div>
        <div>
          <FormInput
            label="Số chương"
            placeholder="Nhập số chương"
            {...formik.getFieldProps("qChapter")}
          />
        </div>
        <div>
          <CustomSelect
            options={[]}
            label="Phần của trang"
            onValueChange={(value) => formik.setFieldValue("qPagePath", value)}
            placeholder="Đầu trang (a)"
          />
        </div>
        <div>
          <FormInput
            label="Số dòng"
            placeholder="Nhập số dòng"
            {...formik.getFieldProps("qLine")}
          />
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <Button type="submit">Tìm kiếm</Button>
      </div>
    </form>
  );
};

export default SutraSearchForm;
