import clsx from "clsx";
import { IoEyeOutline } from "react-icons/io5";
import FormInput, { FormInputProps } from "src/components/ui/FormInput";

const PasswordInput = ({
  showPassword,
  togglePasswordVisibility,
  ...FormInputProps
}: {
  showPassword: boolean;
  togglePasswordVisibility: () => void;
} & FormInputProps) => {
  return (
    <div className="relative">
      <FormInput
        {...FormInputProps}
        type={showPassword ? "text" : "password"}
        placeholder="Nhập mật khẩu tại đây ..."
        className={clsx("pl-3 pr-10", FormInputProps.className)}
      />
      <div
        className="flex absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer"
        onClick={togglePasswordVisibility}
      >
        <IoEyeOutline className="" />
      </div>
    </div>
  );
};

export default PasswordInput;
