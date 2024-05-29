import { useFormik } from "formik";
import { useCallback, useEffect, useState, type FC } from "react";
import { FileDatasApi } from "src/api/files";
import CustomSheet from "src/components/CustomSheet";
import FileDropzone from "src/components/FileDropzone";
import { Button } from "src/components/shadcn/ui/button";
import { Progress } from "src/components/shadcn/ui/progress";
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
  const { updateVolume, createVolume, createVolumesByFile } =
    useVolumesContext();
  const [tab, setTab] = useState("single");
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);

  const { showSnackbarError } = useAppSnackbar();

  const handleSubmitMultiple = useCallback(
    async ({}) => {
      setProgress(0.001);
      await createVolumesByFile(files, setProgress);
    },
    [createVolumesByFile, files]
  );
  const handleSubmitMultipleHelper = useFunction(handleSubmitMultiple, {
    successMessage: "Tạo quyển kinh thành công",
  });

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
          id: volume.id,
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

  const handleClickSubmit = useCallback(() => {
    if (tab == "single") {
      formik.handleSubmit();
    } else {
      handleSubmitMultipleHelper.call({});
    }
  }, [formik, handleSubmitMultipleHelper, tab]);

  useEffect(() => {
    if (volume?.id && open) {
      formik.setValues(volume);
    } else {
      formik.resetForm();
      formik.setValues(initialVolume);
      setFiles([]);
      setProgress(0);
      handleSubmitHelper.reset();
      handleSubmitMultipleHelper.reset();
      setTab("single");
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

  useEffect(() => {
    setFiles([]);
  }, [tab]);

  return (
    <CustomSheet
      open={open}
      onOpenChange={onOpenChange}
      sheetTrigger={<Button>Tạo quyển kinh</Button>}
      title={volume ? "Sửa quyển kinh" : "Tạo quyển kinh"}
      actions={
        <Button
          onClick={handleClickSubmit}
          disabled={
            handleSubmitHelper.loading || handleSubmitMultipleHelper.loading
          }
        >
          {volume ? "Sửa" : "Tạo"} quyển kinh
        </Button>
      }
      tabs={
        volume
          ? undefined
          : {
              defaultValue: "single",
              value: tab,
              onValueChange: setTab,
              options: [
                { value: "single", label: "Tạo quyển kinh" },
                { value: "multiple", label: "Tạo nhiều quyển kinh" },
              ],
            }
      }
    >
      <form onSubmit={formik.submitForm} className="grid grid-cols-2 gap-4">
        {tab == "single" ? (
          <>
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
          </>
        ) : (
          <div className="col-span-2 text-text-secondary">
            {"Tải lên file đặt tên theo cú pháp <Mã quyển>_<Tên quyển>"}
          </div>
        )}
        <div className="col-span-2">
          <FileDropzone
            multiple={tab == "multiple"}
            fileCount={files.length}
            onUpload={setFiles}
            onClear={() => setFiles([])}
            accept={{
              "image/*": [".png", ".jpg", ".jpeg"],
              "application/pdf": [".pdf"],
            }}
            title="Tải lên file văn bản gốc"
            subtitle="File Ảnh (PDF,PNG hoặc JPG)"
          />
        </div>
        {handleSubmitMultipleHelper.error ? (
          <div className="text-sm text-destructive col-span-2">
            {handleSubmitMultipleHelper.error?.message}
          </div>
        ) : (
          tab == "multiple" &&
          progress > 0 && (
            <div className="col-span-2 flex gap-2 items-center -mt-2">
              <div className="flex-1">
                <Progress value={progress * 100} className="bg-gray-300 h-3" />
              </div>
              <div className="w-[160px] text-text-secondary">
                Đang upload... {Math.floor(progress * 100)}%
              </div>
            </div>
          )
        )}
      </form>
    </CustomSheet>
  );
};

export default VolumeEditSheet;
