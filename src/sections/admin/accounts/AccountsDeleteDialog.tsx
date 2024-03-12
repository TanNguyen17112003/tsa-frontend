import { Report } from "src/types/report";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "src/components/shadcn/ui/dialog";
import { Button } from "src/components/shadcn/ui/button";
import useFunction from "src/hooks/use-function";
import { useCallback } from "react";
import { useUsersContext } from "src/contexts/users/users-context";
import { User } from "src/types/user";
import { RiErrorWarningLine } from "react-icons/ri";

const AccountsDeleteDialog = ({
  state = false,
  onClose,
  id,
}: {
  state: boolean;
  onClose: () => void;
  id: string;
}) => {
  const { deleteUser } = useUsersContext();
  const handleDelete = useCallback(
    async (values: any) => {
      if (id) {
        await deleteUser([id]);
      }
      onClose();
    },
    [deleteUser, onClose, id]
  );

  const handleDeleteHelper = useFunction(handleDelete, {
    successMessage: "Xóa tài khoản thành công!",
  });
  return (
    <Dialog open={state} onOpenChange={(value) => !value && onClose()}>
      <DialogTrigger asChild>
        {/* <Button variant="outline">Chi tiết khiếu nại</Button> */}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex pt-4">
            <RiErrorWarningLine
              style={{
                padding: "8px",
                fontSize: "2.5rem",
                backgroundColor: "mistyrose",
                borderRadius: "25px",
                color: "red",
              }}
            />
            <div className="pl-4 pt-1.5">Xóa tài khoản</div>
          </DialogTitle>
          <div className="pl-14">Xác nhận xóa tài khoản này</div>
        </DialogHeader>
        <DialogFooter className="flex">
          <Button type="submit" variant={"outline"} onClick={onClose}>
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            variant={"destructive"}
            onClick={handleDeleteHelper.call}
          >
            Xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AccountsDeleteDialog;
