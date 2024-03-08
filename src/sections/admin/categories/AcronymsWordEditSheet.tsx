"use client";
import { useFormik } from "formik";
import { FC, useEffect } from "react";
import CustomSheet from "src/components/CustomSheet";
import { Button } from "src/components/shadcn/ui/button";
import { Input } from "src/components/shadcn/ui/input";
import FormInput from "src/components/ui/FormInput";
import { useFormatWordsContext } from "src/contexts/format-words/format-words-context";
import useAppSnackbar from "src/hooks/use-app-snackbar";
import useFunction from "src/hooks/use-function";
import {
  FormatWord,
  formatWordSchema,
  initialFormatWord,
} from "src/types/format-word";

export interface AcronymsWordEditSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formatWord?: FormatWord;
}

const AcronymsWordEditSheet: FC<AcronymsWordEditSheetProps> = ({
  open,
  onOpenChange,
  formatWord,
}) => {
  const { createFormatWord } = useFormatWordsContext();
  const createFormatWordHelper = useFunction(createFormatWord);
  const { showSnackbarSuccess, showSnackbarError } = useAppSnackbar();

  const formik = useFormik({
    initialValues: initialFormatWord,
    validationSchema: formatWordSchema,
    onSubmit: async (values) => {
      try {
        createFormatWordHelper.call({ ...values });
        showSnackbarSuccess("Thêm thành công!");
        onOpenChange(!open);
      } catch (error: any) {
        console.error(error);
      }
    },
  });

  useEffect(() => {
    if (!open) {
      formik.resetForm();
      formik.setValues(initialFormatWord);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <CustomSheet
      open={open}
      onOpenChange={onOpenChange}
      sheetTrigger={<Button>Thêm tên viết tắt</Button>}
      title={"Thêm tên viết tắt"}
      actions={
        <Button type="submit" onClick={() => formik.handleSubmit()}>
          Xác nhận thêm
        </Button>
      }
    >
      <div className="flex flex-col gap-2">
        <div className="text-xs font-semibold ml-1">Từ đầy đủ</div>
        <FormInput
          type="text"
          placeholder="Nhập từ đầy đủ"
          className="w-full px-3"
          {...formik.getFieldProps("full")}
          error={formik.touched.full && !!formik.errors.full}
          helperText={!!formik.touched.full && formik.errors.full}
        />
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <div className="text-xs font-semibold ml-1">Từ viết tắt</div>
        <FormInput
          type="text"
          placeholder="Nhập từ viết tắt"
          className="w-full px-3"
          {...formik.getFieldProps("short")}
          error={formik.touched.short && !!formik.errors.short}
          helperText={!!formik.touched.short && formik.errors.short}
        />
      </div>
    </CustomSheet>
  );
};

export default AcronymsWordEditSheet;
