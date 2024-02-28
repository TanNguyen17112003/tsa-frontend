import { useFormik } from "formik";
import { useCallback, useEffect, type FC } from "react";
import CustomSheet from "src/components/CustomSheet";
import { Button } from "src/components/shadcn/ui/button";
import FormInput from "src/components/ui/FormInput";
import { useSutrasContext } from "src/contexts/sutras/sutras-context";
import { useAuth } from "src/hooks/use-auth";
import useFunction from "src/hooks/use-function";
import { Sutra, SutraDetail, sutraSchema, initialSutra } from "src/types/sutra";

export interface SutraEditSheetProps {
  sutra?: SutraDetail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SutraEditSheet: FC<SutraEditSheetProps> = ({
  sutra,
  open,
  onOpenChange,
}) => {
  const { user } = useAuth();
  const { updateSutra, createSutra } = useSutrasContext();
  const handleSubmit = useCallback(
    async (values: Sutra) => {
      if (sutra) {
        await updateSutra({
          ...values,
        });
      } else {
        await createSutra({
          ...values,
          user_id: user?.id || "",
          created_at: new Date(),
        });
      }
      onOpenChange(false);
    },
    [sutra, onOpenChange, updateSutra, createSutra, user?.id]
  );
  const handleSubmitHelper = useFunction(handleSubmit, {
    successMessage: (sutra ? "Sửa" : "Thêm") + " tuyển tập kinh thành công!",
  });

  const formik = useFormik({
    initialValues: initialSutra,
    validationSchema: sutraSchema,
    onSubmit: handleSubmitHelper.call,
  });

  useEffect(() => {
    if (sutra?.id && open) {
      formik.setValues(sutra);
    } else {
      formik.resetForm();
      formik.setValues(initialSutra);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sutra?.id, open]);

  console.log("formik.values", formik.values);
  return (
    <CustomSheet
      open={open}
      onOpenChange={onOpenChange}
      sheetTrigger={<Button>Tạo tuyển tập kinh</Button>}
      title="Tạo tuyển tập kinh"
      actions={
        <Button onClick={() => formik.handleSubmit()}>
          Tạo tuyển tập kinh
        </Button>
      }
    >
      <form onSubmit={formik.submitForm} className="grid-cols-2 gap-4">
        <div>
          <FormInput
            autoFocus
            type="text"
            label="Mã bộ kinh (*)"
            placeholder="Nhập mã bộ kinh..."
            className="w-full px-3"
            {...formik.getFieldProps("code")}
            error={formik.touched.code && !!formik.errors.code}
            helperText={!!formik.touched.code && formik.errors.code}
          />
        </div>
        <div>
          <FormInput
            type="text"
            label="Tên bộ kinh"
            placeholder="Nhập tên bộ kinh..."
            className="w-full px-3"
            {...formik.getFieldProps("name")}
            error={formik.touched.name && !!formik.errors.name}
            helperText={!!formik.touched.name && formik.errors.name}
          />
        </div>
        <div>
          <FormInput
            autoFocus
            type="text"
            label="Mã tuyển tập kinh"
            placeholder="Nhập mã tuyển tập kinh..."
            className="w-full px-3"
            {...formik.getFieldProps("code")}
            error={formik.touched.code && !!formik.errors.code}
            helperText={!!formik.touched.code && formik.errors.code}
          />
        </div>
        <div>
          <FormInput
            type="text"
            label="Tên tuyển tập kinh"
            placeholder="Nhập tuyển tập kinh..."
            className="w-full px-3"
            {...formik.getFieldProps("name")}
            error={formik.touched.name && !!formik.errors.name}
            helperText={!!formik.touched.name && formik.errors.name}
          />
        </div>
      </form>
    </CustomSheet>
  );
};

export default SutraEditSheet;
