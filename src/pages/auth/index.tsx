import { useEffect, useState } from "react";
import SimpleBar from "simplebar-react";
import { useAuth } from "src/hooks/use-auth";
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import type { Page as PageType } from "src/types/page";
import Image from "next/image";
import backgroundImage from "../../images/background-siu.png";
import { EyeIcon } from "src/components/icons/EyeIcon";
import HeaderTitle from "src/components/ui/HeaderTitle";
import { ArrowLeft } from "src/components/icons/ArrowLeft";
import { useRouter } from "next/router";
import { AuthContext, AuthProvider } from "src/contexts/auth/jwt-context";

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
  const { signIn } = useAuth();
  const handleSignUp = () => {
    router.push("/auth/register");
  };

  const handleSignIn = () => {
    signIn("admin", "1234")
      .then((response) => {
        console.log("Result: ", response);
      })
      .catch((error: any) => {
        console.log("Error: ", error);
      });
  };

  return (
    <div className="h-screen flex ">
      <Image
        src={backgroundImage}
        className="flex-1 min-w-0 object-cover"
        alt="Background images"
      />

      <div className="flex flex-col max-w-max max-h-max justify-center items-center px-[106px]">
        <HeaderTitle />
        <div className="justify-start items-start max-w-max max-h-max ">
          <div className="flex flex-col gap-2">
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
              Mật khẩu
            </span>
            {/* <input
                type="text"
                placeholder="Nhập mật khẩu tại đây ..."
                className="input input-bordered w-[388px] px-3"
              /> */}
            <PasswordInput />
          </div>
          <div className="mt-5"></div>
          <button
            className="btn btn-primary text-white w-full"
            onClick={() => handleSignIn()}
          >
            Đăng nhập
          </button>
          <div className="flex items-center gap-0">
            <button
              className="btn bg-none border-none  text-[#F97316] px-4 pt-1 pb-1 w-[136px] h-[24px] text-xs	 "
              onClick={() => handleSignUp()}
            >
              Đăng ký tài khoản
            </button>
            <span>/</span>
            <button className="btn bg-none border-none text-[#F97316] px-4 pt-1 pb-1 w-[136px] h-[24px] text-xs	">
              Quên mật khẩu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

Page.getLayout = (page) => <AuthProvider>{page}</AuthProvider>;

export default Page;
