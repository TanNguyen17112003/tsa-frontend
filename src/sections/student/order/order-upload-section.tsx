import { Stack, StackProps, Typography } from '@mui/material';
import _ from 'lodash';
import { useCallback, useState } from 'react';
import { File, FileDropzone } from 'src/components/file-dropzone';
import useAppSnackbar from 'src/hooks/use-app-snackbar';
import { downloadUrl } from 'src/utils/url-handler';
import * as XLSX from 'xlsx';
import { StudentOrderImport } from 'src/types/order';

function OrderUploadSection({
  onUpload,
  disabled,
  addDisable,
  setAddDisable,
  handleUpload,
  studentErrors,
  ...StackProps
}: {
  onUpload: (orders: StudentOrderImport[]) => void;
  disabled?: boolean;
  addDisable?: boolean;
  setAddDisable?: (value: number) => void;
  handleUpload?: (value: boolean) => void;
  studentErrors?: string[];
} & StackProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [activitiesErrors, setActivtiesErrors] = useState<string[]>([]);
  const { showSnackbarError } = useAppSnackbar();

  const handleRemove = useCallback(
    async (file: File): Promise<void> => {
      await setFiles((prevFiles) => {
        return prevFiles.filter((_file) => _file.path !== file.path);
      });
      handleUpload!(false);
      onUpload([]);
    },
    [handleUpload, onUpload]
  );

  const handleRemoveAll = useCallback(async (): Promise<void> => {
    await setFiles([]);
    handleUpload!(false);
    onUpload([]);
  }, [handleUpload, onUpload]);

  return (
    <Stack spacing={2} {...StackProps}>
      <Stack gap={2} flex={1}>
        <Typography variant='body2'>
          File import là file Excel (xlsx hoặc xls) mẫu được hệ thống cung cấp.
          <br />
          Lưu ý: File không đúng quy định sẽ không thể import.
        </Typography>
        <Typography
          sx={{
            color: 'text.secondary'
          }}
        >
          Download File mẫu tại&nbsp;
          <Typography
            component='span'
            sx={{ color: 'primary.main', cursor: 'pointer' }}
            onClick={() => {
              downloadUrl('/docs/import-activities.xlsx', '[Mẫu]Import danh sách hoạt động');
            }}
          >
            Đây 👈
          </Typography>
        </Typography>
      </Stack>

      <Stack flex={1}>
        <FileDropzone
          title='Nhấn tải lên file danh sách'
          accept={{ '*/*': [] }}
          caption={'File Excel (.xlsx hoặc .xls)'}
          files={files}
          onDrop={() => {}}
          onRemove={handleRemove}
          onRemoveAll={handleRemoveAll}
          onUpload={() => {}}
          type='single'
        />
      </Stack>

      {activitiesErrors.length > 0 && (
        <Stack gap={0.5}>
          <Typography color='error' fontWeight='bold'>
            Không tìm thấy thông tin của các hoạt động sau trong hệ thống. Các hoạt động còn lại vẫn
            sẽ được thêm
          </Typography>
          {activitiesErrors.map((ae) => (
            <Typography color='error' variant='subtitle2' sx={{ ml: 2 }} key={ae}>
              {ae}
            </Typography>
          ))}
        </Stack>
      )}

      {studentErrors && studentErrors.length > 0 && (
        <Stack gap={0.5}>
          <Typography color='error' fontWeight='bold'>
            *Có lỗi trong file import sinh viên của bạn. Vui lòng kiểm tra lại!
          </Typography>
          {studentErrors.map((ae) => (
            <Typography color='error' variant='subtitle2' key={ae}>
              - {ae}
            </Typography>
          ))}
        </Stack>
      )}
    </Stack>
  );
}

export default OrderUploadSection;
