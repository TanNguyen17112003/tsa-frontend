import Image from "next/image";
import { useEffect, useState } from "react";
import { EyeIcon } from "src/components/icons/EyeIcon";
import { useAuth } from "src/hooks/use-auth";
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import type { Page as PageType } from "src/types/page";
import backgroundImage from "../../images/background-siu.svg";
import HeaderTitle from "src/components/ui/HeaderTitle";
import { ArrowLeft } from "src/components/icons/ArrowLeft";
import { useRouter } from "next/router";
import { AuthProvider } from "src/contexts/auth/jwt-context";

const PasswordInput = () => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="relative ">
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Nhập mật khẩu tại đây ..."
        className="input input-bordered w-[388px] pl-3 pr-10 placeholder:w-[334px] placeholder:h-[20px] focus:placeholder:w-[334px] 
        focus:placeholder:h-[20px]"
      />
      <div
        className="flex absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer"
        onClick={togglePasswordVisibility}
      >
        <EyeIcon className="" />
      </div>
    </div>
  );
};
const Page: PageType = () => {
  const router = useRouter();

  const handleGoBack = () => {
    // Xử lý khi nút "Quay lại" được nhấp vào.
    console.log("Quay lại");
    router.push("/auth");
    // Thêm logic xử lý quay lại tại đây.
  };
  return (
    <>
      <div className="h-screen flex ">
        <Image
          src={backgroundImage}
          className="flex-1 min-w-0 object-cover"
          alt="Background images"
        />
        <div className="flex flex-col max-w-max max-h-screen justify-center px-[106px]">
          <HeaderTitle />
          <div
            className="flex items-center  px-4 pt-1 pb-1 rounded-lg border-slate-200 gap-2  w-[115px] text-xs h-[24px] "
            onClick={handleGoBack}
            style={{
              cursor: "pointer",
              border: "1px solid #E5E7EB",
              background: "rgba(255, 255, 255, 0.00)",
            }}
          >
            <ArrowLeft className="w-[14px] h-[7px]" />
            <span className="label color-label-input-caret label-text text-xs font-text-xs-semibold font-semibold w-[60px] h-[16px]">
              Quay lại
            </span>
          </div>

          <div className="justify-start items-start w-full mt-3">
            <div className="flex flex-col gap-2">
              <span className="label color-label-input-caret label-text text-xs font-text-xs-semibold font-semibold">
                Họ và tên
              </span>
              <input
                type="text"
                placeholder="Nhập họ và tên của bạn ..."
                className="input input-bordered w-[388px] px-3"
              />
              <div className="gap-6"></div>

              <span className="label color-label-input-caret label-text text-xs font-text-xs-semibold font-semibold">
                Tên đăng nhập
              </span>
              <input
                type="text"
                placeholder="Nhập tên đăng nhập tại đây ..."
                className="input input-bordered w-[388px] px-3"
              />
              <div className="gap-6"></div>
              <span className="label color-label-input-caret label-text text-xs font-text-xs-semibold font-semibold">
                Địa chỉ Email
              </span>
              <input
                type="text"
                placeholder="Nhập địa chỉ Email tại đây ..."
                className="input input-bordered w-[388px] px-3"
              />
              <div className="gap-6"></div>
              <span className="label color-label-input-caret label-text text-xs font-text-xs-semibold font-semibold">
                Mật khẩu
              </span>

              <PasswordInput />
              <div className="gap-6"></div>
              <span className="label color-label-input-caret label-text text-xs font-text-xs-semibold font-semibold">
                Nhập lại mật khẩu
              </span>

              <PasswordInput />
              <div className="gap-6"></div>
            </div>
            <div className="mt-5"></div>
            <button className="btn btn-primary text-white w-full">
              Đăng ký
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

Page.getLayout = (page) => <AuthProvider>{page}</AuthProvider>;

export default Page;
