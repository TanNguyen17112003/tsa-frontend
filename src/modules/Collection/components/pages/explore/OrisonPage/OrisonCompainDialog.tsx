import { Button } from "src/components/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "src/components/shadcn/ui/dialog";
import { Input } from "src/components/shadcn/ui/input";
import { Label } from "src/components/shadcn/ui/label";
import CollectionBreadcrumb from "../../../CollectionBreadcrumb";
import FormInput from "src/components/ui/FormInput";
import { useFormik } from "formik";
import { formatReportSchema, initialReport } from "src/types/report";
import useFunction from "src/hooks/use-function";
import { useReportsContext } from "src/contexts/reports/reports-context";
import { useAuth } from "src/hooks/use-auth";
import useAppSnackbar from "src/hooks/use-app-snackbar";
import { Textarea } from "src/components/shadcn/ui/textarea";
import { BaseSelection } from "slate";
import { formatDate } from "date-fns";

const OrisonComplainDialog = ({
  isOpen,
  onClose,
  data,
  selection,
  orisonId,
}: {
  isOpen: boolean;
  onClose: () => void;
  data: string;
  selection?: BaseSelection;
  orisonId?: string;
}) => {
  const { createReport } = useReportsContext();
  const createReportHelper = useFunction(createReport);
  const { user } = useAuth();
  const { showSnackbarSuccess, showSnackbarError } = useAppSnackbar();

  const formik = useFormik({
    initialValues: initialReport,
    validationSchema: formatReportSchema,
    onSubmit: async (values) => {
      try {
        const { error } = await createReportHelper.call({
          ...values,
          user_id: user?.id || "",
          report_status: "pending",
          selection: selection,
          selection_content: data,
          orison_id: orisonId || "",
        });

        if (!error) {
          showSnackbarSuccess("Gửi khiếu nại thành công!");

          const activityLog = localStorage.getItem("activityLogs");
          const activity = activityLog ? JSON.parse(activityLog) : [];
          const currentDay = new Date();

          activity.unshift({
            action: "Khiếu nại",
            updated_at: formatDate(currentDay, "hh:mm - dd/MM/yy"),
            lines: selection?.anchor.path[0],
            orison_id: orisonId,
            user_id: user?.id || "",
          });

          localStorage.setItem("activityLogs", JSON.stringify(activity));

          formik.resetForm();
          onClose();
        } else {
          showSnackbarError("Gửi khiếu nại không thành công!");
        }
      } catch (error: any) {
        console.error(error);
      }
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild>
        {/* <Button variant="outline">Edit Profile</Button> */}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Khiếu nại
          </DialogTitle>
          <DialogDescription>
            <CollectionBreadcrumb />
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <div className="text-sm font-semibold pb-2">Email</div>
            <FormInput
              type="text"
              placeholder="Nhập email của bạn tại đây"
              className="w-full px-3"
              {...formik.getFieldProps("email")}
              error={formik.touched.email && !!formik.errors.email}
              helperText={!!formik.touched.email && formik.errors.email}
            />
          </div>
          <div>
            <div className="text-sm font-semibold pb-2">Tiêu đề</div>
            <FormInput
              type="text"
              placeholder="Nhập tiêu đề"
              className="w-full px-3"
              {...formik.getFieldProps("title")}
              error={formik.touched.title && !!formik.errors.title}
              helperText={!!formik.touched.title && formik.errors.title}
            />
          </div>
          <div>
            <div className="text-sm font-semibold pb-2">Nội dung</div>
            <Textarea
              placeholder="Nhập nội dung feedback tại đây."
              {...formik.getFieldProps("content")}
              className="h-52"
            />
            <div className="text-xs font-normal text-secondary pt-2">
              Tối đa 500 ký tự
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={() => formik.handleSubmit()}>
            Gửi khiếu nại
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrisonComplainDialog;
