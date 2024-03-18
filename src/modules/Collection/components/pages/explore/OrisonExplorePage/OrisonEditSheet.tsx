import { useFormik } from "formik";
import { useCallback, useEffect, useState, type FC } from "react";
import CustomSheet from "src/components/CustomSheet";
import { Button } from "src/components/shadcn/ui/button";
import FormInput from "src/components/ui/FormInput";
import { useOrisonsContext } from "src/contexts/orisons/orisons-context";
import useFunction from "src/hooks/use-function";
import { SutraDetail } from "src/types/sutra";
import {
  Orison,
  OrisonDetail,
  initialOrison,
  orisonSchema,
} from "src/types/orison";
import { VolumeDetail } from "src/types/volume";
import FileDropzone from "src/components/FileDropzone";
import { Progress } from "src/components/shadcn/ui/progress";

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
  const { updateOrison, createOrison, createOrisonsByFile } =
    useOrisonsContext();
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [tab, setTab] = useState("single");

  const handleSubmit = useCallback(
    async (values: Orison) => {
      if (orison) {
        await updateOrison({
          ...values,
        });
      } else if (volume.id) {
        if (!files[0]) {
          throw "Vui lòng chọn file bài kinh";
        }
        await createOrison({
          ...values,
          created_at: new Date(),
          volume_id: volume.id,
          sutra: sutra,
          file: files[0],
        });
      } else {
        throw new Error("Vui lòng chọn quyển");
      }
      onOpenChange(false);
    },
    [orison, volume.id, onOpenChange, updateOrison, createOrison, sutra, files]
  );

  const handleSubmitMultiple = useCallback(
    async ({}) => {
      setProgress(0.001);
      await createOrisonsByFile(files, setProgress);
    },
    [createOrisonsByFile, files]
  );
  const handleSubmitMultipleHelper = useFunction(handleSubmitMultiple, {
    successMessage: "Tạo quyển kinh thành công",
  });

  const handleSubmitHelper = useFunction(handleSubmit, {
    successMessage: (orison ? "Sửa" : "Thêm") + " quyển kinh thành công!",
  });

  const formik = useFormik<OrisonDetail>({
    initialValues: initialOrison,
    validationSchema: orisonSchema,
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
    if (orison?.id && open) {
      formik.setValues(orison);
    } else {
      formik.resetForm();
      formik.setValues(initialOrison);
      setFiles([]);
      setProgress(0);
      handleSubmitHelper.reset();
      handleSubmitMultipleHelper.reset();
      setTab("single");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orison?.id, open]);

  return (
    <CustomSheet
      open={open}
      onOpenChange={onOpenChange}
      sheetTrigger={<Button>Tạo bài kinh</Button>}
      title={orison ? "Sửa bài kinh" : "Tạo bài kinh"}
      actions={
        <Button onClick={handleClickSubmit}>
          {orison ? "Sửa" : "Tạo"} bài kinh
        </Button>
      }
      tabs={
        orison
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
            </div>{" "}
          </>
        ) : (
          <div className="col-span-2 text-text-secondary">
            {"Tải lên file đặt tên theo cú pháp <Mã bài>_<Tên bài>"}
          </div>
        )}
        <div className="col-span-2">
          <FileDropzone
            multiple={tab == "multiple"}
            fileCount={files.length}
            onUpload={setFiles}
            onClear={() => setFiles([])}
            accept={{
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                [".docx"],
            }}
            title="Tải lên file văn bản"
            subtitle="File Word (.docx)"
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
                {handleSubmitMultipleHelper.loading
                  ? "Đang upload..."
                  : "Hoàn thành"}{" "}
                {Math.floor(progress * 100)}%
              </div>
            </div>
          )
        )}
      </form>
    </CustomSheet>
  );
};

export default OrisonEditSheet;
