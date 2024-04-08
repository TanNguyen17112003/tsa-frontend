import { useFormik } from "formik";
import { useCallback, useEffect, type FC, useMemo, useState } from "react";
import CustomSelect from "src/components/CustomSelect";
import CustomSheet from "src/components/CustomSheet";
import FileDropzone from "src/components/FileDropzone";
import { Button } from "src/components/shadcn/ui/button";
import FormInput from "src/components/ui/FormInput";
import { useCollectionCategoriesContext } from "src/contexts/collections/collection-categories-context";
import { useSutrasContext } from "src/contexts/sutras/sutras-context";
import { useAuth } from "src/hooks/use-auth";
import useFunction from "src/hooks/use-function";
import { Collection } from "src/types/collection";
import { Sutra, SutraDetail, sutraSchema, initialSutra } from "src/types/sutra";

export interface SutraEditSheetProps {
  collection: Collection;
  sutra?: SutraDetail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SutraEditSheet: FC<SutraEditSheetProps> = ({
  collection,
  sutra,
  open,
  onOpenChange,
}) => {
  const { user } = useAuth();
  const { updateSutra, createSutra } = useSutrasContext();
  const [files, setFiles] = useState<File[]>([]);
  const { categories } = useCollectionCategoriesContext();
  const { authors, translators, circas } = categories;
  const createSutraHelper = useFunction(createSutra);

  const authorOptions = useMemo(() => {
    return authors.map((author) => ({
      label: author.author,
      value: author.id,
    }));
  }, [authors]);

  const translatorOptions = useMemo(() => {
    return translators.map((translator) => ({
      label: translator.full_name,
      value: translator.id,
    }));
  }, [translators]);

  const circaOptions = useMemo(() => {
    return circas.map((circa) => ({
      label: `${circa.start_year} - ${circa.end_year}`,
      value: circa.id,
    }));
  }, [circas]);

  const handleSubmit = useCallback(
    async (values: SutraDetail) => {
      if (sutra) {
        await updateSutra({
          ...values,
          author: authors.find((author) => author.id == values.author_id)!,
          circa: circas.find((circa) => circa.id == values.circa_id)!,
          translator: translators.find(
            (translator) => translator.id == values.user_id
          )!,
        });
      } else if (collection.id) {
        await createSutra({
          ...values,
          created_at: new Date(),
          collection_id: collection.id,
          num_orisons: 0,
          author: authors.find((author) => author.id == values.author_id)!,
          circa: circas.find((circa) => circa.id == values.circa_id)!,
          translator: translators.find(
            (translator) => translator.id == values.user_id
          )!,
        });
      } else {
        throw new Error("Vui lòng chọn tuyển tập");
      }
      onOpenChange(false);
    },
    [
      sutra,
      collection.id,
      onOpenChange,
      updateSutra,
      authors,
      circas,
      translators,
      createSutra,
    ]
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

  return (
    <CustomSheet
      open={open}
      onOpenChange={onOpenChange}
      sheetTrigger={<Button>Tạo bộ kinh</Button>}
      title={sutra ? "Sửa bộ kinh" : "Tạo bộ kinh"}
      actions={
        <Button onClick={() => formik.handleSubmit()}>
          {sutra ? "Sửa" : "Tạo"} bộ kinh
        </Button>
      }
    >
      <form onSubmit={formik.submitForm} className="grid grid-cols-2 gap-4">
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
          <CustomSelect
            label="Tác giả"
            placeholder="Chọn tác giả"
            className="w-full px-3"
            onValueChange={(value) => formik.setFieldValue("author_id", value)}
            value={formik.values.author_id}
            error={formik.touched.author_id && !!formik.errors.author_id}
            helperText={!!formik.touched.author_id && formik.errors.author_id}
            options={authorOptions}
          />
        </div>
        <div>
          <CustomSelect
            label="Dịch giả"
            placeholder="Chọn dịch giả"
            className="w-full px-3"
            value={formik.values.user_id}
            onValueChange={(value) => formik.setFieldValue("user_id", value)}
            error={formik.touched.user_id && !!formik.errors.user_id}
            helperText={!!formik.touched.user_id && formik.errors.user_id}
            options={translatorOptions}
          />
        </div>
        <div className="col-span-2">
          <CustomSelect
            label="Niên đại"
            placeholder="Chọn niên đại"
            className="w-full px-3"
            value={formik.values.circa_id}
            onValueChange={(value) => formik.setFieldValue("circa_id", value)}
            error={formik.touched.circa_id && !!formik.errors.circa_id}
            helperText={!!formik.touched.circa_id && formik.errors.circa_id}
            options={circaOptions}
          />
        </div>
        <div className="col-span-2 mt-4">
          <FileDropzone
            onUpload={(newFiles) => setFiles([...files, ...newFiles])}
            onClear={() => setFiles([])}
            fileCount={files.length}
            title="Tải lên file văn bản gốc"
            subtitle="File Ảnh (PDF,PNG hoặc JPG)"
          />
        </div>
      </form>
    </CustomSheet>
  );
};

export default SutraEditSheet;
