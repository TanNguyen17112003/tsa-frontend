import { Logo } from "./Logo";

const SplashScreen = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-screen z-1400 bg-background flex flex-col items-center justify-center p-10">
      <div className="w-48 h-48">
        <Logo />
      </div>
    </div>
  );
};

export default SplashScreen;
