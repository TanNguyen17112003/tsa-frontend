import { useFormik } from "formik";
import { useCallback, useEffect, useState, type FC } from "react";
import { FileDatasApi } from "src/api/files";
import CustomSheet from "src/components/CustomSheet";
import FileDropzone from "src/components/FileDropzone";
import { Button } from "src/components/shadcn/ui/button";
import FormInput from "src/components/ui/FormInput";
import { useVolumesContext } from "src/contexts/volumes/volumes-context";
import useAppSnackbar from "src/hooks/use-app-snackbar";
import { useAuth } from "src/hooks/use-auth";
import useFunction from "src/hooks/use-function";
import { FileData } from "src/types/file-data";
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

  const { showSnackbarError } = useAppSnackbar();

  const handleSubmit = useCallback(
    async (values: Volume) => {
      let fileData: FileData | null = null;
      if (files[0]) {
        fileData = await FileDatasApi.uploadFileData({
          file: files[0],
        });
      }
      if (volume) {
        await updateVolume({
          ...values,
          file_id: fileData?.id,
        });
      } else if (sutra.id) {
        await createVolume({
          ...values,
          created_at: new Date(),
          sutras_id: sutra.id,
          sutra: sutra,
          file_id: fileData?.id,
          file: fileData || undefined,
        });
      } else {
        throw new Error("Vui lòng chọn tuyển tập");
      }
      onOpenChange(false);
    },
    [files, volume, sutra, onOpenChange, updateVolume, createVolume]
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
      setFiles([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volume?.id, open]);

  useEffect(() => {
    if (files[0]) {
      const [code, name] = files[0].name.split("_");
      if (!code || !name) {
        showSnackbarError("Tên file không hợp lệ");
        setFiles([]);
      }
      formik.setValues({ ...initialVolume, name, code });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files, showSnackbarError]);

  return (
    <CustomSheet
      open={open}
      onOpenChange={onOpenChange}
      sheetTrigger={<Button>Tạo quyển kinh</Button>}
      title="Tạo quyển kinh"
      actions={
        <Button onClick={() => formik.handleSubmit()}>Tạo quyển kinh</Button>
      }
      tabs={{
        defaultValue: "single",
        options: [
          { value: "single", label: "Tạo quyển kinh" },
          { value: "multiple", label: "Tạo nhiều quyển kinh" },
        ],
      }}
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
        <div className="col-span-2">
          <FileDropzone
            multiple={false}
            fileCount={files.length}
            onUpload={setFiles}
          />
        </div>
      </form>
    </CustomSheet>
  );
};

export default VolumeEditSheet;
