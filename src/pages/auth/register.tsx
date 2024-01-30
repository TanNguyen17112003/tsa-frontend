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
import PasswordInput from "src/components/ui/PasswordInput";
import { paths } from "src/paths";

const Page: PageType = () => {
  const router = useRouter();
  const { signUp } = useAuth();
  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleGoBack = () => {
    console.log("Quay lại");
    router.replace(paths.auth.login);
  };

  const handleSignUp = async () => {
    try {
      const response = await signUp(
        email,
        username,
        fullName,
        password,
        confirmPassword
      );
      console.log(response);
      router.replace(paths.auth.login);
    } catch (error: any) {
      console.error(error);
    }
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
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <div className="gap-6"></div>

              <span className="label color-label-input-caret label-text text-xs font-text-xs-semibold font-semibold">
                Tên đăng nhập
              </span>
              <input
                type="text"
                placeholder="Nhập tên đăng nhập tại đây ..."
                className="input input-bordered w-[388px] px-3"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <div className="gap-6"></div>
              <span className="label color-label-input-caret label-text text-xs font-text-xs-semibold font-semibold">
                Địa chỉ Email
              </span>
              <input
                type="text"
                placeholder="Nhập địa chỉ Email tại đây ..."
                className="input input-bordered w-[388px] px-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="gap-6"></div>
              <span className="label color-label-input-caret label-text text-xs font-text-xs-semibold font-semibold">
                Mật khẩu
              </span>
              <PasswordInput
                onChange={(e: any) => setPassword(e.target.value)}
                value={password}
                showPassword={showPassword}
                togglePasswordVisibility={() => setShowPassword(!showPassword)}
              />
              <div className="gap-6"></div>
              <span className="label color-label-input-caret label-text text-xs font-text-xs-semibold font-semibold">
                Nhập lại mật khẩu
              </span>

              <PasswordInput
                onChange={(e: any) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                showPassword={showConfirmPassword}
                togglePasswordVisibility={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              />
              <div className="gap-6"></div>
            </div>
            <div className="mt-5"></div>
            <button
              className="btn btn-primary text-white w-full"
              onClick={() => handleSignUp()}
            >
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
