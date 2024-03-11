"use client";
import { useFormik } from "formik";
import { FC, useCallback, useEffect } from "react";
import CustomSheet from "src/components/CustomSheet";
import { Button } from "src/components/shadcn/ui/button";
import { Input } from "src/components/shadcn/ui/input";
import FormInput from "src/components/ui/FormInput";
import { useCircasContext } from "src/contexts/circas/circas-context";
import useAppSnackbar from "src/hooks/use-app-snackbar";
import useFunction from "src/hooks/use-function";
import { Circa, circaSchema, initialCirca } from "src/types/circas";

export interface CircaEditSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  circa?: Circa;
}

const CircaEditSheet: FC<CircaEditSheetProps> = ({
  open,
  onOpenChange,
  circa,
}) => {
  const { createCirca, updateCirca } = useCircasContext();
  const createCircaHelper = useFunction(createCirca);

  const handleSubmit = useCallback(
    async (values: Circa) => {
      if (circa) {
        await updateCirca({
          ...values,
          id: circa.id,
        });
      } else {
        try {
          createCircaHelper.call({
            ...values,
          });
        } catch (error: any) {
          console.error(error);
        }
      }
      onOpenChange(false);
    },
    [circa, onOpenChange, updateCirca, createCircaHelper]
  );

  const handleSubmitHelper = useFunction(handleSubmit, {
    successMessage: (circa ? "Sửa" : "Thêm") + " tác giả thành công!",
  });

  const formik = useFormik({
    initialValues: initialCirca,
    validationSchema: circaSchema,
    onSubmit: handleSubmitHelper.call,
  });

  useEffect(() => {
    if (open && circa) {
      formik.resetForm();
      formik.setValues(circa);
    } else {
      formik.resetForm();
      formik.setValues(initialCirca);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <CustomSheet
      open={open}
      onOpenChange={onOpenChange}
      sheetTrigger={<Button>Thêm niên đại</Button>}
      title={circa ? "Chỉnh sửa niên đại" : "Thêm niên đại"}
      actions={
        <Button type="submit" onClick={() => formik.handleSubmit()}>
          Xác nhận {circa ? "sửa" : "thêm"}
        </Button>
      }
    >
      <div className="flex flex-col gap-2">
        <div className="text-xs font-semibold ml-1">Niên đại</div>
        <FormInput
          type="text"
          placeholder="Nhập niên đại"
          className="w-full px-3"
          {...formik.getFieldProps("name")}
          error={formik.touched.name && !!formik.errors.name}
          helperText={!!formik.touched.name && formik.errors.name}
        />
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <div className="text-xs font-semibold ml-1">Thời gian bắt đầu</div>
        <FormInput
          type="number"
          placeholder="Nhập thời gian bắt đầu"
          className="w-full px-3"
          {...formik.getFieldProps("start_year")}
          error={formik.touched.start_year && !!formik.errors.start_year}
          helperText={!!formik.touched.start_year && formik.errors.start_year}
        />
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <div className="text-xs font-semibold ml-1">Thời gian kết thúc</div>
        <FormInput
          type="number"
          placeholder="Nhập thời gian kết thúc"
          className="w-full px-3"
          {...formik.getFieldProps("end_year")}
          error={formik.touched.end_year && !!formik.errors.end_year}
          helperText={!!formik.touched.end_year && formik.errors.end_year}
        />
      </div>
    </CustomSheet>
  );
};

export default CircaEditSheet;
