import { useFormik } from "formik";
import { useCallback, useEffect, useState, type FC } from "react";
import CustomSheet from "src/components/CustomSheet";
import { Button } from "src/components/shadcn/ui/button";
import FormInput from "src/components/ui/FormInput";
import { useOrisonsContext } from "src/contexts/orisons/orisons-context";
import { useAuth } from "src/hooks/use-auth";
import useFunction from "src/hooks/use-function";
import { SutraDetail } from "src/types/sutra";
import {
  Orison,
  OrisonDetail,
  initialOrison,
  orisonSchema,
} from "src/types/orison";
import { VolumeDetail } from "src/types/volume";

export interface OrisonEditSheetProps {
  sutra: SutraDetail;
  volume: VolumeDetail;
  orison?: OrisonDetail;

  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OrisonEditSheet: FC<OrisonEditSheetProps> = ({
  volume,
  sutra,
  orison,
  open,
  onOpenChange,
}) => {
  const { user } = useAuth();
  const { updateOrison, createOrison } = useOrisonsContext();
  const [files, setFiles] = useState<File[]>([]);

  const handleSubmit = useCallback(
    async (values: Orison) => {
      if (orison) {
        await updateOrison({
          ...values,
        });
      } else if (sutra.id) {
        await createOrison({
          ...values,
          created_at: new Date(),
          volume_id: volume.id,
          sutra: sutra,
        });
      } else {
        throw new Error("Vui lòng chọn tuyển tập");
      }
      onOpenChange(false);
    },
    [orison, sutra, onOpenChange, updateOrison, createOrison, volume.id]
  );
  const handleSubmitHelper = useFunction(handleSubmit, {
    successMessage: (orison ? "Sửa" : "Thêm") + " quyển kinh thành công!",
  });

  const formik = useFormik({
    initialValues: initialOrison,
    validationSchema: orisonSchema,
    onSubmit: handleSubmitHelper.call,
  });

  useEffect(() => {
    if (orison?.id && open) {
      formik.setValues(orison);
    } else {
      formik.resetForm();
      formik.setValues(initialOrison);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orison?.id, open]);

  return (
    <CustomSheet
      open={open}
      onOpenChange={onOpenChange}
      sheetTrigger={<Button>Tạo bài kinh</Button>}
      title="Tạo bài kinh"
      actions={
        <Button onClick={() => formik.handleSubmit()}>Tạo bài kinh</Button>
      }
    >
      <form onSubmit={formik.submitForm} className="grid grid-cols-2 gap-4">
        <div>
          <FormInput
            autoFocus
            type="text"
            label="Mã bài kinh (*)"
            placeholder="Nhập mã bài kinh..."
            className="w-full px-3"
            {...formik.getFieldProps("code")}
            error={formik.touched.code && !!formik.errors.code}
            helperText={!!formik.touched.code && formik.errors.code}
          />
        </div>
        <div>
          <FormInput
            type="text"
            label="Tên bài kinh"
            placeholder="Nhập tên bài kinh..."
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

export default OrisonEditSheet;
