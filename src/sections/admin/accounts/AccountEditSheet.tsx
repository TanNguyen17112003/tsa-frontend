"use client";
import { useFormik } from "formik";
import { FC, useEffect } from "react";
import CustomSheet from "src/components/CustomSheet";
import { Button } from "src/components/shadcn/ui/button";
import * as Yup from "yup";
import { Input } from "src/components/shadcn/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/shadcn/ui/select";
import FormInput from "src/components/ui/FormInput";
import { initialUser } from "src/types/user";
import { userSchema } from "src/types/user";

export interface AccountEditSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AccountEditSheet: FC<AccountEditSheetProps> = ({
  open,
  onOpenChange,
}) => {
  const formik = useFormik({
    initialValues: initialUser,
    validationSchema: userSchema,
    onSubmit: async (values) => {
      try {
        console.log(values);
      } catch (error: any) {
        console.error(error);
      }
    },
  });

  useEffect(() => {
    if (!open) {
      formik.setValues(initialUser);
      formik.resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <CustomSheet
      open={open}
      onOpenChange={onOpenChange}
      sheetTrigger={<Button type="submit">Thêm tài khoản</Button>}
      title={"Thêm tài khoản"}
      actions={
        <Button onClick={() => formik.handleSubmit()} type="submit">
          Xác nhận thêm
        </Button>
      }
    >
      <div className="flex flex-col gap-2">
        <div className="text-sm font-semibold pb-2">Thông tin tài khoản</div>
        <div className="space-y-2">
          <div className="text-xs font-semibold pl-1">Họ và tên</div>
          <FormInput
            type="text"
            placeholder="Nhập họ và tên của bạn ..."
            className="w-full px-3"
            {...formik.getFieldProps("name")}
            error={formik.touched.name && !!formik.errors.name}
            helperText={!!formik.touched.name && formik.errors.name}
          />

          <div className="text-xs font-semibold pl-1">Email {"(*)"}</div>
          <FormInput
            type="text"
            placeholder="Nhập email ..."
            className="w-full px-3"
            {...formik.getFieldProps("email")}
            error={formik.touched.email && !!formik.errors.email}
            helperText={!!formik.touched.email && formik.errors.email}
          />

          <div className="text-xs font-semibold pl-1">
            Tên tài khoản {"(*)"}
          </div>
          <FormInput
            type="text"
            placeholder="Tên tài khoản"
            className="w-full px-3"
            {...formik.getFieldProps("username")}
            error={formik.touched.username && !!formik.errors.username}
            helperText={!!formik.touched.username && formik.errors.username}
          />

          <div className="text-xs font-semibold pl-1">Mật khẩu</div>
          <FormInput
            type="text"
            placeholder="Mật khẩu"
            className="w-full px-3"
            {...formik.getFieldProps("password")}
            error={formik.touched.password && !!formik.errors.password}
            helperText={!!formik.touched.password && formik.errors.password}
            value={formik.values.password}
          />
        </div>
        <div className="text-sm font-semibold pb-2">Thiết lập quyền</div>
        <div>
          <div className="text-xs font-semibold pl-1 pb-2">
            Cho phép dịch giả
          </div>
          <Select
            onValueChange={(value) => {
              formik.setFieldValue("role", value);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chỉ xem được khiếu nại" />
            </SelectTrigger>
            <SelectContent {...formik.getFieldProps("role")}>
              <SelectGroup>
                <SelectItem value="view-reports">
                  Chỉ xem được khiếu nại
                </SelectItem>
                <SelectItem value="handle-reports">
                  Được xử lý khiếu nại
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </CustomSheet>
  );
};

export default AccountEditSheet;
