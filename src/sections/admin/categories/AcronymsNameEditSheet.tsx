"use client";
import { useFormik } from "formik";
import { FC, useCallback, useEffect } from "react";
import CustomSheet from "src/components/CustomSheet";
import { Button } from "src/components/shadcn/ui/button";
import FormInput from "src/components/ui/FormInput";
import { useFormatSutrasContext } from "src/contexts/format-sutras/format-sutras-context";
import useAppSnackbar from "src/hooks/use-app-snackbar";
import useFunction from "src/hooks/use-function";
import { FormatSutra, initialFormatSutra } from "src/types/format-sutra";
import { formatSutraSchema } from "src/types/format-sutra";

export interface AcronymsNameEditSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formatSutra?: FormatSutra;
}

const AcronymsNameEditSheet: FC<AcronymsNameEditSheetProps> = ({
  open,
  onOpenChange,
  formatSutra,
}) => {
  const { createFormatSutra, updateFormatSutra } = useFormatSutrasContext();

  const handleSubmit = useCallback(
    async (values: FormatSutra) => {
      if (formatSutra) {
        await updateFormatSutra({
          ...values,
        });
      } else {
        await createFormatSutra({
          ...values,
        });
      }
      onOpenChange(false);
    },
    [formatSutra, onOpenChange, updateFormatSutra, createFormatSutra]
  );

  const handleSubmitHelper = useFunction(handleSubmit, {
    successMessage: `${
      formatSutra ? "Chỉnh sửa" : "Thêm"
    } tên viết tắt thành công`,
  });

  const formik = useFormik({
    initialValues: initialFormatSutra,
    validationSchema: formatSutraSchema,
    onSubmit: handleSubmitHelper.call,
  });

  useEffect(() => {
    if (formatSutra && open) {
      formik.resetForm();
      formik.setValues(formatSutra);
    } else {
      formik.resetForm();
      formik.setValues(initialFormatSutra);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <CustomSheet
      open={open}
      onOpenChange={onOpenChange}
      sheetTrigger={<Button>Thêm tên viết tắt</Button>}
      title={`${formatSutra ? "Chỉnh sửa" : "Thêm"} tên viết tắt tuyển tập`}
      actions={
        <Button type="submit" onClick={() => formik.handleSubmit()}>
          Xác nhận {formatSutra ? "sửa" : "thêm"}
        </Button>
      }
    >
      <div className="flex flex-col gap-2">
        <div className="text-xs font-semibold ml-1">
          Tên tuyển tập {"(đầy đủ)"}
        </div>
        <FormInput
          type="text"
          placeholder="Nhập tên tuyển tập"
          className="w-full px-3"
          {...formik.getFieldProps("full")}
          error={formik.touched.full && !!formik.errors.full}
          helperText={!!formik.touched.full && formik.errors.full}
        />
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <div className="text-xs font-semibold ml-1">
          Tên tuyển tập {"(viết tắt)"}
        </div>
        <FormInput
          type="text"
          placeholder="Nhập tên viết tắt của tuyển tập"
          className="w-full px-3"
          {...formik.getFieldProps("short")}
          error={formik.touched.short && !!formik.errors.short}
          helperText={!!formik.touched.short && formik.errors.short}
        />
      </div>
    </CustomSheet>
  );
};

export default AcronymsNameEditSheet;
