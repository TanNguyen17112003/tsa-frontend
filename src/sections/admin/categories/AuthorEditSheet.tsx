"use client";
import { useFormik } from "formik";
import { FC, useCallback, useEffect } from "react";
import CustomSheet from "src/components/CustomSheet";
import { Button } from "src/components/shadcn/ui/button";
import * as Yup from "yup";
import { Input } from "src/components/shadcn/ui/input";
import FormInput from "src/components/ui/FormInput";
import { Author, authorSchema, initialAuthor } from "src/types/author";
import { useAuthorsContext } from "src/contexts/authors/authors-context";
import useFunction from "src/hooks/use-function";
import useAppSnackbar from "src/hooks/use-app-snackbar";

export interface AuthorEditSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  author?: Author;
}

const AuthorEditSheet: FC<AuthorEditSheetProps> = ({
  open,
  onOpenChange,
  author,
}) => {
  const { createAuthor, updateAuthor } = useAuthorsContext();

  const handleSubmit = useCallback(
    async (values: Author) => {
      if (author) {
        await updateAuthor({
          ...values,
          id: author.id,
        });
      } else {
        await createAuthor({
          ...values,
        });
      }
      onOpenChange(false);
    },
    [author, onOpenChange, updateAuthor, createAuthor]
  );

  const handleSubmitHelper = useFunction(handleSubmit, {
    successMessage: (author ? "Sửa" : "Thêm") + " tác giả thành công!",
  });

  const formik = useFormik({
    initialValues: initialAuthor,
    validationSchema: authorSchema,
    onSubmit: handleSubmitHelper.call,
  });

  useEffect(() => {
    if (author && open) {
      formik.resetForm();
      formik.setValues(author);
    } else {
      formik.resetForm();
      formik.setValues(initialAuthor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <CustomSheet
      open={open}
      onOpenChange={onOpenChange}
      sheetTrigger={<Button>Thêm tài khoản</Button>}
      title={author ? "Chỉnh sửa tài khoản" : "Thêm tài khoản"}
      actions={
        <Button type="submit" onClick={() => formik.handleSubmit()}>
          {author ? "Xác nhận chỉnh sửa" : "Xác nhận thêm"}
        </Button>
      }
    >
      <div className="flex flex-col gap-2">
        <div className="text-xs font-semibold ml-1">Nhâp tên tác giả</div>
        <FormInput
          type="text"
          placeholder="Nhập tên tác giả"
          className="w-full px-3"
          {...formik.getFieldProps("author")}
          error={formik.touched.author && !!formik.errors.author}
          helperText={!!formik.touched.author && formik.errors.author}
        />
      </div>
    </CustomSheet>
  );
};

export default AuthorEditSheet;
