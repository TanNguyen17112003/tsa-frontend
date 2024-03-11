"use client";
import { useFormik } from "formik";
import { FC, useCallback, useEffect } from "react";
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
  const { createFormatWord, updateFormatWord } = useFormatWordsContext();
  const createFormatWordHelper = useFunction(createFormatWord);
  const { showSnackbarSuccess, showSnackbarError } = useAppSnackbar();

  const handleSubmit = useCallback(
    async (values: FormatWord) => {
      if (formatWord) {
        await updateFormatWord({
          ...values,
        });
      } else {
        try {
          createFormatWordHelper.call({
            ...values,
          });
        } catch (error: any) {
          console.error(error);
        }
      }
      onOpenChange(false);
    },
    [formatWord, onOpenChange, updateFormatWord, createFormatWordHelper]
  );

  const handleSubmitHelper = useFunction(handleSubmit, {
    successMessage: `${
      formatWord ? "Chỉnh sửa" : "Thêm"
    } từ viết tắt thành công`,
  });

  const formik = useFormik({
    initialValues: initialFormatWord,
    validationSchema: formatWordSchema,
    onSubmit: handleSubmitHelper.call,
  });

  useEffect(() => {
    if (formatWord && open) {
      formik.resetForm();
      formik.setValues(formatWord);
    } else {
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
      title={`${formatWord ? "Chỉnh sửa" : "Thêm"} từ viết tắt tuyển tập`}
      actions={
        <Button type="submit" onClick={() => formik.handleSubmit()}>
          Xác nhận {formatWord ? "sửa" : "thêm"}
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
