import { useFormik } from "formik";
import { useCallback, useEffect, type FC } from "react";
import CustomSheet from "src/components/CustomSheet";
import { Button } from "src/components/shadcn/ui/button";
import FormInput from "src/components/ui/FormInput";
import { useCollectionsContext } from "src/contexts/collections/collections-context";
import { useAuth } from "src/hooks/use-auth";
import useFunction from "src/hooks/use-function";
import {
  Collection,
  CollectionDetail,
  collectionSchema,
  initialCollection,
} from "src/types/collection";

export interface CollectionEditSheetProps {
  collection?: CollectionDetail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CollectionEditSheet: FC<CollectionEditSheetProps> = ({
  collection,
  open,
  onOpenChange,
}) => {
  const { user } = useAuth();
  const { updateCollection, createCollection } = useCollectionsContext();

  const handleSubmit = useCallback(
    async (values: Collection) => {
      if (collection) {
        await updateCollection({
          ...values,
        });
      } else {
        await createCollection({
          ...values,
          user_id: user?.id || "",
          num_authors: 0,
          num_translators: 0,
          num_sutras: 0,
          num_orisons: 0,
          created_at: new Date(),
        });
      }
      onOpenChange(false);
    },
    [collection, onOpenChange, updateCollection, createCollection, user?.id]
  );
  const handleSubmitHelper = useFunction(handleSubmit, {
    successMessage:
      (collection ? "Sửa" : "Thêm") + " tuyển tập kinh thành công!",
  });

  const formik = useFormik({
    initialValues: initialCollection,
    validationSchema: collectionSchema,
    onSubmit: handleSubmitHelper.call,
  });

  useEffect(() => {
    if (collection?.id && open) {
      formik.setValues(collection);
    } else {
      formik.resetForm();
      formik.setValues(initialCollection);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection?.id, open]);

  return (
    <CustomSheet
      open={open}
      onOpenChange={onOpenChange}
      sheetTrigger={<Button>Tạo tuyển tập kinh</Button>}
      title={collection ? "Sửa tuyển tập kinh" : "Tạo tuyển tập kinh"}
      actions={
        <Button onClick={() => formik.handleSubmit()}>
          {collection ? "Sửa" : "Tạo"} tuyển tập kinh
        </Button>
      }
    >
      <form onSubmit={formik.submitForm} className="flex gap-3">
        <div className="flex-1">
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
        <div className="flex-1">
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

export default CollectionEditSheet;
