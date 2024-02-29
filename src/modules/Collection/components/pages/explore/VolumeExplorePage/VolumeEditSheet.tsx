import { useFormik } from "formik";
import { useCallback, useEffect, useState, type FC } from "react";
import CustomSheet from "src/components/CustomSheet";
import { Button } from "src/components/shadcn/ui/button";
import FormInput from "src/components/ui/FormInput";
import { useVolumesContext } from "src/contexts/volumes/volumes-context";
import { useAuth } from "src/hooks/use-auth";
import useFunction from "src/hooks/use-function";
import { SutraDetail } from "src/types/sutra";
import {
  Volume,
  VolumeDetail,
  initialVolume,
  volumeSchema,
} from "src/types/volume";

export interface VolumeEditSheetProps {
  sutra: SutraDetail;
  volume?: VolumeDetail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VolumeEditSheet: FC<VolumeEditSheetProps> = ({
  sutra,
  volume,
  open,
  onOpenChange,
}) => {
  const { user } = useAuth();
  const { updateVolume, createVolume } = useVolumesContext();
  const [files, setFiles] = useState<File[]>([]);

  const handleSubmit = useCallback(
    async (values: Volume) => {
      if (volume) {
        await updateVolume({
          ...values,
        });
      } else if (sutra.id) {
        await createVolume({
          ...values,
          created_at: new Date(),
          sutras_id: sutra.id,
          sutra: sutra,
        });
      } else {
        throw new Error("Vui lòng chọn tuyển tập");
      }
      onOpenChange(false);
    },
    [volume, sutra, onOpenChange, updateVolume, createVolume]
  );
  const handleSubmitHelper = useFunction(handleSubmit, {
    successMessage: (volume ? "Sửa" : "Thêm") + " quyển kinh thành công!",
  });

  const formik = useFormik({
    initialValues: initialVolume,
    validationSchema: volumeSchema,
    onSubmit: handleSubmitHelper.call,
  });

  useEffect(() => {
    if (volume?.id && open) {
      formik.setValues(volume);
    } else {
      formik.resetForm();
      formik.setValues(initialVolume);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volume?.id, open]);

  console.log("formik.errors", formik.errors);

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
      <form onSubmit={formik.submitForm} className="grid grid-cols-2 gap-4">
        <div>
          <FormInput
            autoFocus
            type="text"
            label="Mã quyển kinh (*)"
            placeholder="Nhập mã quyển kinh..."
            className="w-full px-3"
            {...formik.getFieldProps("code")}
            error={formik.touched.code && !!formik.errors.code}
            helperText={!!formik.touched.code && formik.errors.code}
          />
        </div>
        <div>
          <FormInput
            type="text"
            label="Tên quyển kinh"
            placeholder="Nhập tên quyển kinh..."
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

export default VolumeEditSheet;
