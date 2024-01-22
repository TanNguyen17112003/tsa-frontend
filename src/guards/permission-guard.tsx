import { useMemo, type FC, type ReactNode } from "react";
import { Error } from "src/components/error";
import { useAuth } from "src/hooks/use-auth";

interface PermissionGuardProps {
  children: ReactNode;
  apiActions: string[];
  hideText?: boolean;
}

export const PermissionGuard: FC<PermissionGuardProps> = (props) => {
  const { children, apiActions, hideText } = props;
  const { user } = useAuth();

  const userApiActions = useMemo(
    () => new Set([...(user?.api_actions || [])]),
    [user?.api_actions]
  );
  const pageAllowed = useMemo(
    () => apiActions.some((paa) => userApiActions.has(paa)),
    [userApiActions, apiActions]
  );

  if (!pageAllowed) {
    return hideText ? null : (
      <Error
        statusCode={403}
        title={`Bạn không có quyền truy cập trang này!`}
      />
    );
  }

  return <>{children}</>;
};
