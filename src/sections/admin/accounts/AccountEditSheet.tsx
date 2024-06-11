"use client";
import { useFormik } from "formik";
import { FC, useCallback, useEffect } from "react";
import CustomSheet from "src/components/CustomSheet";
import { Button } from "src/components/shadcn/ui/button";
import FormInput from "src/components/ui/FormInput";
import { User, initialUser } from "src/types/user";
import { userSchema } from "src/types/user";
import CustomSelect from "src/components/CustomSelect";
import { useAuth } from "src/hooks/use-auth";
import { useUsersContext } from "src/contexts/users/users-context";
import useFunction from "src/hooks/use-function";
import * as yup from "yup";

const userSchemaWithoutPass = yup.object().shape({
  username: yup.string().required("Vui lòng nhập username"),
  email: yup
    .string()
    .email("Vui lòng nhập đúng định dạng email")
    .required("Vui lòng nhập email"),
  full_name: yup.string().required("Vui lòng nhập name"),
});

export interface AccountEditSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account?: User;
}

const roleOptions = [
  {
    label: "Chỉ xem được khiếu nại",
    value: "user",
  },
  {
    label: "Được xử lý khiếu nại",
    value: "admin",
  },
];

const AccountEditSheet: FC<AccountEditSheetProps> = ({
  open,
  onOpenChange,
  account,
}) => {
  const { createUser, updateUser } = useUsersContext();

  const handleSubmit = useCallback(
    async (values: User) => {
      if (account) {
        await updateUser({
          ...values,
          confirm_password: values.password,
        });
      } else {
        await createUser({
          ...values,
          confirm_password: values.password,
        });
      }
      onOpenChange(false);
    },
    [account, onOpenChange, updateUser, createUser]
  );

  const handleSubmitHelper = useFunction(handleSubmit, {
    successMessage: `${account ? "Chỉnh sửa" : "Thêm"} tài khoản thành công`,
  });

  const formik = useFormik({
    initialValues: {
      ...initialUser,
      password: "siu@123",
      role: "user",
    },
    validationSchema: account ? userSchemaWithoutPass : userSchema,
    onSubmit: handleSubmitHelper.call,
  });

  useEffect(() => {
    if (open && account) {
      formik.resetForm();
      formik.setValues({ ...account });
    } else if (!open) {
      formik.resetForm();
      formik.setValues({
        ...initialUser,
        password: "siu@123",
        role: "user",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <CustomSheet
      open={open}
      onOpenChange={onOpenChange}
      sheetTrigger={<Button>Thêm tài khoản</Button>}
      title={`${account ? "Chỉnh sửa" : "Thêm"} tài khoản`}
      actions={
        <Button type="submit" onClick={() => formik.handleSubmit()}>
          Xác nhận {account ? "sửa" : "thêm"}
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
            {...formik.getFieldProps("full_name")}
            error={formik.touched.full_name && !!formik.errors.full_name}
            helperText={!!formik.touched.full_name && formik.errors.full_name}
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

          {!account && (
            <>
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
            </>
          )}
        </div>
        <div className="text-sm font-semibold pb-2">Thiết lập quyền</div>
        <div>
          <CustomSelect
            label="Cho phép dịch giả"
            placeholder="Phân quyền"
            className="w-full px-3"
            onValueChange={(value) => formik.setFieldValue("role", value)}
            value={formik.values.role}
            error={formik.touched.role && !!formik.errors.role}
            helperText={!!formik.touched.role && formik.errors.role}
            options={roleOptions}
          />
        </div>
      </div>
    </CustomSheet>
  );
};

export default AccountEditSheet;
