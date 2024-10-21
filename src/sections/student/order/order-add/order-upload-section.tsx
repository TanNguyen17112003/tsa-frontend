import { Stack, StackProps, Typography } from '@mui/material';
import _ from 'lodash';
import { useCallback, useState } from 'react';
import { File, FileDropzone } from 'src/components/file-dropzone';
import useAppSnackbar from 'src/hooks/use-app-snackbar';
import { downloadUrl } from 'src/utils/url-handler';
import * as XLSX from 'xlsx';
import { OrderFormProps } from 'src/api/orders';
import useFunction from 'src/hooks/use-function';

function OrderUploadSection({
  onUpload,
  disabled,
  addDisable,
  setAddDisable,
  handleUpload,
  orderErrors,
  ...StackProps
}: {
  onUpload: (orders: OrderFormProps[]) => void;
  disabled?: boolean;
  addDisable?: boolean;
  setAddDisable?: (value: number) => void;
  handleUpload?: (value: boolean) => void;
  orderErrors?: string[];
} & StackProps) {
  const [files, setFiles] = useState<File[]>([]);
  const { showSnackbarError } = useAppSnackbar();

  const handleDrop = useCallback(
    async (newFiles: File[]) => {
      handleUpload!(true);
      if (newFiles.length > 0) {
        setFiles([newFiles[0]]);
        const file = newFiles[0];
        const error = await new Promise<string | []>((resolve) => {
          let json: any[] | undefined;
          try {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = (e) => {
              try {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                console.log('workboook', workbook);
                const sheet_name_list = workbook.SheetNames;
                let range = 8;
                const temp: { [key: string]: any }[] = XLSX.utils.sheet_to_json(
                  workbook.Sheets[sheet_name_list[0]]
                );
                console.log('temp[1]', temp[1]);
                if (temp[0]['Mã ĐH'] != undefined) {
                  range = 0;
                }
                const raw: { [key: string]: any }[] = XLSX.utils.sheet_to_json(
                  workbook.Sheets[sheet_name_list[0]],
                  { range: range }
                );
                console.log('raw', raw);
                for (let j = 0; j < raw.length; j++) {
                  raw[j] = _.transform(raw[j], (result, val, key) => {
                    result[
                      key
                        .toString()
                        .toLowerCase()
                        .replace(/[,"'?\\\/!@#$%^&*]/g, '')
                        .trim()
                    ] = val;
                  });
                }
                json = raw;
                const newOrders = json.map((item) => {
                  const orderID = String(item['mã đh']).trim();

                  const weight = item['khối lượng (kg)'];
                  const product = String(item['sản phẩm'] || '').trim();
                  const dormitory = String(item['kí túc xá'] || '').trim();
                  const room = String(item['phòng'] || '').trim();
                  const building = String(item['tòa'] || '').trim();
                  const deliveryDate = item['thời gian giao hàng (yyyy-mm-ddthh:mm)'];
                  const paymentMethod = String(
                    item['phương thức thanh toán (momo cash credit)']
                  ).trim();
                  return {
                    checkCode: orderID,
                    weight,
                    product,
                    dormitory,
                    room,
                    building,
                    deliveryDate,
                    paymentMethod: paymentMethod as 'MOMO' | 'CASH' | 'CREDIT'
                  };
                });
                if (newOrders.length == 0) {
                  showSnackbarError('File rỗng hoặc sai cấu trúc');
                }
                onUpload(newOrders);
                resolve('');
              } catch (error) {
                resolve(String(error));
              }
              // Transform key to lowercase to validate
            };
          } catch (error) {
            resolve(String(error));
          }
        });
      }
      handleUpload!(false); // Ensure handleUpload is called with false when upload ends
    },
    [onUpload, showSnackbarError, setAddDisable, handleUpload]
  );
  const handleDropHelper = useFunction(handleDrop);

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
              downloadUrl('/docs/import-student-orders.xlsx', '[Mẫu]Import danh sách đơn hàng');
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
          onDrop={handleDropHelper.call}
          onRemove={handleRemove}
          onRemoveAll={handleRemoveAll}
          onUpload={() => {}}
          type='single'
        />
      </Stack>

      {orderErrors && orderErrors.length > 0 && (
        <Stack gap={0.5}>
          <Typography color='error' fontWeight='bold'>
            *Có lỗi trong file import sinh viên của bạn. Vui lòng kiểm tra lại!
          </Typography>
          {orderErrors.map((ae) => (
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
