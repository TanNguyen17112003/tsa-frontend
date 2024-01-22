import type { FC, ReactNode } from "react";
import { Error } from "src/components/error";
import { useNetworkState } from "src/contexts/common/network-state-context";

interface OnlineGuardProps {
  children: ReactNode;
}

const OnlineGuard: FC<OnlineGuardProps> = ({ children }) => {
  const { isOnline } = useNetworkState();

  if (isOnline) {
    return <>{children}</>;
  }
  return (
    <Error statusCode={404} title="Chức năng không khả dụng khi mất kết nối" />
  );
};

export default OnlineGuard;
