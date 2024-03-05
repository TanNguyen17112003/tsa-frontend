import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect, type FC } from "react";
import { Button } from "src/components/shadcn/ui/button";
import FormInput from "src/components/ui/FormInput";

interface CircaSearchFormProps {}

interface CircaSearchQuery {
  qCircaFrom: string;
  qCircaTo: string;
}

const initialCircaSearchQuery: CircaSearchQuery = {
  qCircaFrom: "",
  qCircaTo: "",
};

const CircaSearchForm: FC<CircaSearchFormProps> = ({}) => {
  const router = useRouter();

  const formik = useFormik({
    initialValues: initialCircaSearchQuery,
    onSubmit: (values) => {
      router.replace({
        pathname: router.pathname,
        query: { ...router.query, ...values },
      });
    },
  });

  useEffect(() => {
    if (router.query) {
      formik.setValues(router.query as unknown as CircaSearchQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  return (
    <form className="flex gap-4 items-end" onSubmit={formik.handleSubmit}>
      <div className="flex-1">
        <FormInput
          label="Từ năm"
          placeholder="VD: 250"
          {...formik.getFieldProps("qCircaFrom")}
        />
      </div>
      <div className="flex-1">
        <FormInput
          label="Đến năm"
          placeholder="VD: 350"
          {...formik.getFieldProps("qCircaTo")}
        />
      </div>
      <Button type="submit">Tìm kiếm</Button>
    </form>
  );
};

export default CircaSearchForm;
