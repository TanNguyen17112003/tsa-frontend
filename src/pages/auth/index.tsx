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
import {
  AuthContext,
  AuthContextType,
  AuthProvider,
} from "src/contexts/auth/jwt-context";
import PasswordInput from "src/components/ui/PasswordInput";
import { paths } from "src/paths";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMounted } from "src/hooks/use-mounted";
import { usePageView } from "src/hooks/use-page-view";

interface Values {
  user_name: string;
  password: string;
  submit: null;
}

const initialValues: Values = {
  user_name: "",
  password: "",
  submit: null,
};

const validationSchema = Yup.object({
  user_name: Yup.string().max(255).required("user_name is required"),
  password: Yup.string().max(255).required("Password is required"),
});
const Page: PageType = () => {
  const isMounted = useMounted();
  const router = useRouter();
  const { signIn } = useAuth<AuthContextType>();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = () => {
    router.replace(paths.auth.register);
  };

  const handleSignIn = async () => {
    try {
      await signIn(username, password);
      router.replace(paths.dashboard.index);
    } catch (error: any) {
      console.error(error);
      setError("Vui lòng kiểm tra lại Tên đăng nhập/Mật khẩu");
    }
  };

  useEffect(() => {
    if (username || password) {
      setError("");
    }
  }, [username, password]);

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
              onChange={(e) => setUsername(e.target.value)}
              value={username}
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
          </div>
          <div className="mt-5"></div>
          {error && (
            <div>
              <p className="text-sm font-semibold text-center flex items-center justify-center h-29 text-[#EF4444] gap-6">
                {error}
              </p>
              <div className="mt-5"> </div>
            </div>
          )}
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
