import { useFormik } from "formik";
import { useEffect } from "react";
import { Button } from "src/components/shadcn/ui/button";
import { Input } from "src/components/shadcn/ui/input";
import FormInput from "src/components/ui/FormInput";
import { useAuth } from "src/hooks/use-auth";
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import * as Yup from "yup";
import type { Page as PageType } from "src/types/page";

const validationSchema = Yup.object({
  title: Yup.string().required("Tiêu đề không được để trống"),
  content: Yup.string().required("Nội dung không được để trống"),
  email: Yup.string()
    .email("Địa chỉ email không hợp lệ")
    .required("Email không được để trống"),
});

const Page: PageType = () => {
  const formik = useFormik({
    initialValues: {
      email: "",
      title: "",
      content: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        console.log(values);
        //todo
      } catch (error: any) {
        console.error(error);
      }
    },
  });

  useEffect(() => {
    if (!open) {
      formik.resetForm();
      formik.setValues({
        email: "",
        title: "",
        content: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <div className="px-[10%]">
      <div className="text-2xl font-semibold py-8">Khiếu nại</div>
      <div className="flex border py-8 px-7 space-x-8 w-full rounded-3xl">
        <div className="w-full space-y-2">
          <div className="text-xs font-semibold">Email</div>
          <FormInput
            type="text"
            placeholder="Nhập email của bạn tại đây"
            className="w-full px-3"
            {...formik.getFieldProps("email")}
            error={formik.touched.email && !!formik.errors.email}
            helperText={!!formik.touched.email && formik.errors.email}
          />
        </div>
        <div className="flex-col w-full space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-semibold">Tiêu đề</div>
            <FormInput
              type="text"
              placeholder="Nhập tiêu đề"
              className="w-full px-3"
              {...formik.getFieldProps("title")}
              error={formik.touched.title && !!formik.errors.title}
              helperText={!!formik.touched.title && formik.errors.title}
            />
          </div>
          <div className="space-y-2">
            <div className="text-xs font-semibold">Nội dung</div>
            <FormInput
              type="text"
              placeholder="Nhập nội dung feedback tại đây."
              className="w-full px-3"
              {...formik.getFieldProps("content")}
              error={formik.touched.content && !!formik.errors.content}
              helperText={!!formik.touched.content && formik.errors.content}
            />
            <div className="text-xs font-normal text-gray-500">
              Tối đa 500 ký tự
            </div>
          </div>
          <Button
            className="flex ml-auto"
            onClick={() => formik.handleSubmit()}
          >
            Gửi khiếu nại
          </Button>
        </div>
      </div>
    </div>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
