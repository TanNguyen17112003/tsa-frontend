import type { FC, ReactNode } from 'react';
import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from 'src/hooks/use-auth';
import { useFirebaseAuth } from 'src/hooks/use-auth';
import { paths } from 'src/paths';
import { Issuer } from 'src/utils/auth';
import { useRouter } from 'next/router';

const bannedPaths = paths.banned.index;

interface BannedGuardProps {
  children: ReactNode;
}

export const BannedGuard: FC<BannedGuardProps> = (props) => {
  const { children } = props;
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { isAuthenticated: isFirebaseAuthenticated, user: firebaseUser } = useFirebaseAuth();
  const [checked, setChecked] = useState(false);

  const check = useCallback(() => {
    if (isAuthenticated && (user?.status === 'BANNED' || user?.status === 'DEACTIVATED')) {
      if (router.pathname !== paths.tickets.index && router.pathname !== paths.auth.logout) {
        router.replace(bannedPaths);
        return;
      }
    }
    if (
      isFirebaseAuthenticated &&
      (firebaseUser?.status === 'BANNED' || firebaseUser?.status === 'DEACTIVATED')
    ) {
      if (router.pathname !== paths.tickets.index && router.pathname !== paths.auth.logout) {
        router.replace(bannedPaths);
        return;
      }
    }

    if (!isFirebaseAuthenticated && !isAuthenticated) {
      const searchParams = new URLSearchParams({
        returnTo: window.location.href
      }).toString();
      const href = paths.auth.login + `?${searchParams}`;
      router.replace(href);
      return;
    }

    setChecked(true);
  }, [isAuthenticated, isFirebaseAuthenticated, router, user, firebaseUser]);

  useEffect(() => {
    check();
  }, [check]);

  if (!checked) {
    return null; // Show nothing until the check is complete
  }

  // If got here, it means that the redirect did not occur, and that tells us that the user is
  // authenticated / authorized or on allowed pages.
  return <>{children}</>;
};
BannedGuard.propTypes = {
  children: PropTypes.any
};
