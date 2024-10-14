import type { User as FirebaseUser } from '@firebase/auth';
import {
  applyActionCode,
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updatePassword,
  updateProfile,
  verifyPasswordResetCode
} from 'firebase/auth';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import type { FC, ReactNode } from 'react';
import { createContext, useCallback, useEffect, useReducer, useState } from 'react';
import { UsersApi } from 'src/api/users';
import useAppSnackbar from 'src/hooks/use-app-snackbar';
import { errorMap, firebaseApp } from 'src/libs/firebase';
import { paths } from 'src/paths';
import { RegisterValues } from 'src/types/auth/auth-register';
import type { User, UserDetail } from 'src/types/user';
import { Issuer } from 'src/utils/auth';
import CookieHelper, { CookieKeys } from 'src/utils/cookie-helper';

const auth = getAuth(firebaseApp);

interface State {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: UserDetail | null;
}

enum ActionType {
  INITIALIZE = 'INITIALIZE',
  SIGN_IN = 'SIGN_IN',
  UPDATE = 'UPDATE'
}

type UpdateAction = {
  type: ActionType.UPDATE;
  payload: {
    user: Partial<UserDetail>;
  };
};

type InitializeAction = {
  type: ActionType.INITIALIZE;
  payload: {
    isAuthenticated: boolean;
    user: UserDetail | null;
  };
};

type SignInAction = {
  type: ActionType.SIGN_IN;
  payload: {
    user: UserDetail;
  };
};
type Handler = (state: State, action: any) => State;

type Action = InitializeAction | SignInAction | UpdateAction;

const initialState: State = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

const handlers: Record<ActionType, Handler> = {
  INITIALIZE: (state: State, action: InitializeAction): State => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  },
  SIGN_IN: (state: State, action: SignInAction): State => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  UPDATE: (state: State, action: UpdateAction): State => {
    const { user } = action.payload;
    return {
      ...state,
      isAuthenticated: true,
      user: state.user ? { ...state.user, ...user } : null
    };
  }
};
const reducer = (state: State, action: Action): State =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

export interface AuthContextType extends State {
  issuer: Issuer.Firebase;
  register: (value: RegisterValues) => Promise<any>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
    reTypeNewPassword: string
  ) => Promise<any>;

  signInWithEmailAndPassword: (email: string, password: string) => Promise<UserDetail | null>;
  signInWithGoogle: () => Promise<UserDetail | null>;
  signInAnonymously: () => Promise<UserDetail | null>;

  sendPasswordResetEmail: (email: string) => Promise<any>;
  verifyPasswordResetCode: (oobCode: string) => Promise<any>;
  confirmPasswordReset: (oobCode: string, newPassword: string) => Promise<any>;
  applyActionCode: (oobCode: string) => Promise<any>;
  sendEmailVerification: () => Promise<any>;
  signOut: () => Promise<void>;
  signOutAnonymously: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  ...initialState,
  issuer: Issuer.Firebase,
  register: () => Promise.resolve(),
  changePassword: () => Promise.resolve(),
  signInWithEmailAndPassword: () => Promise.resolve(null),
  signInWithGoogle: () => Promise.resolve(null),
  signInAnonymously: () => Promise.resolve(null),
  sendPasswordResetEmail: () => Promise.resolve(),
  verifyPasswordResetCode: () => Promise.resolve(),
  confirmPasswordReset: () => Promise.resolve(),
  applyActionCode: () => Promise.resolve(),
  sendEmailVerification: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
  signOutAnonymously: () => Promise.resolve()
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = (props) => {
  const router = useRouter();
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const [fbUser, setFbUser] = useState<FirebaseUser | null>(null);
  const { showSnackbarError } = useAppSnackbar();

  const initialize = useCallback(async (): Promise<void> => {
    try {
      const accessToken = CookieHelper.getItem(CookieKeys.TOKEN);
      if (accessToken) {
        let user: UserDetail | undefined = undefined;
        try {
          const partialUser = await UsersApi.me();
          if (
            partialUser &&
            partialUser.id &&
            partialUser.role &&
            partialUser.lastName &&
            partialUser.firstName
          ) {
            user = partialUser as UserDetail;
          }
        } catch {}

        if (!user) {
          throw new Error('Get user failed.');
        }

        if (user.email && !user.verified) {
          throw new Error('User not verified');
        }

        dispatch({
          type: ActionType.INITIALIZE,
          payload: {
            isAuthenticated: true,
            user
          }
        });
      } else {
        dispatch({
          type: ActionType.INITIALIZE,
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    } catch (err) {
      console.error(err);
      dispatch({
        type: ActionType.INITIALIZE,
        payload: {
          isAuthenticated: false,
          user: null
        }
      });
    }
  }, [router]);

  useEffect(
    () => {
      initialize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(
    () => onAuthStateChanged(auth, setFbUser),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const getToken = useCallback(
    async (user: FirebaseUser): Promise<UserDetail> => {
      try {
        const idToken = await user.getIdToken();
        const response = await UsersApi.loginFirebase({ idToken: idToken });

        if (!response.accessToken) {
          await auth.signOut();
          throw new Error('Get token failed!');
        }

        CookieHelper.setItem(CookieKeys.TOKEN, response.accessToken);
        localStorage.setItem('user_data', JSON.stringify(response.userInfo));

        dispatch({
          type: ActionType.SIGN_IN,
          payload: {
            user: response.userInfo
          }
        });
        setFbUser(user);
        return response.userInfo;
      } catch (error) {
        if (errorMap[(error as any).code]) {
          throw new Error(errorMap[(error as any).code]);
        }
        throw error;
      }
    },
    [dispatch]
  );

  const _signInAnonymously = useCallback(async (): Promise<UserDetail> => {
    try {
      const { user } = await signInAnonymously(auth);
      return await getToken(user);
    } catch (error) {
      if (errorMap[(error as any).code]) {
        throw new Error(errorMap[(error as any).code]);
      }
      throw error;
    }
  }, [getToken]);

  const _signInWithEmailAndPassword = useCallback(
    async (email: string, password: string): Promise<UserDetail> => {
      try {
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        return await getToken(user);
      } catch (error) {
        if (errorMap[(error as any).code]) {
          throw new Error(errorMap[(error as any).code]);
        }
        throw error;
      }
    },
    [getToken]
  );

  const signInWithGoogle = useCallback(async (): Promise<UserDetail> => {
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      return await getToken(user);
    } catch (error) {
      if (errorMap[(error as any).code]) {
        throw new Error(errorMap[(error as any).code]);
      }
      throw error;
    }
  }, [getToken]);

  const changePassword = useCallback(
    async (
      currentPassword: string,
      newPassword: string,
      reTypeNewPassword: string
    ): Promise<void> => {
      try {
        const userInfo = state.user;
        if (!userInfo || !userInfo.email) {
          await initialize();
        }
        if (!userInfo || !userInfo.email) {
          throw new Error('Lỗi');
        }
        const { user } = await signInWithEmailAndPassword(auth, userInfo.email, currentPassword);

        if (newPassword !== reTypeNewPassword) {
          throw new Error('Nhập lại mật khẩu không khớp');
        }
        await updatePassword(user, newPassword);
      } catch (error) {
        if (errorMap[(error as any).code]) {
          throw new Error(errorMap[(error as any).code]);
        }
        throw error;
      }
    },
    [state.user]
  );

  const register = useCallback(async (value: RegisterValues) => {
    const { email, password, lastName, firstName } = value;
    try {
      // Create a user record without password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: `${lastName} ${firstName}` });
      await sendEmailVerification(user, {
        url: window.location.origin + paths.auth.login
      });
    } catch (error) {
      if (errorMap[(error as any).code]) {
        throw new Error(errorMap[(error as any).code]);
      }
      throw error;
    }
  }, []);

  const _sendEmailVerification = useCallback(async () => {
    try {
      console.log('fbUser', fbUser);
      if (!fbUser) {
        throw new Error('Not logged in');
      }
      await sendEmailVerification(fbUser, {
        url: window.location.origin + paths.auth.login
      });
      return true;
    } catch (error) {
      if (errorMap[(error as any).code]) {
        throw new Error(errorMap[(error as any).code]);
      }
      throw error;
    }
  }, [fbUser]);

  const _sendPasswordResetEmail = useCallback(async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      if (errorMap[(error as any).code]) {
        throw new Error(errorMap[(error as any).code]);
      }
      throw error;
    }
  }, []);

  const _verifyPasswordResetCode = useCallback(async (oobCode: string) => {
    try {
      await verifyPasswordResetCode(auth, oobCode);
    } catch (error) {
      if (errorMap[(error as any).code]) {
        throw new Error(errorMap[(error as any).code]);
      }
      throw error;
    }
  }, []);

  const _confirmPasswordReset = useCallback(async (oobCode: string, newPassword: string) => {
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
    } catch (error) {
      if (errorMap[(error as any).code]) {
        throw new Error(errorMap[(error as any).code]);
      }
      throw error;
    }
  }, []);

  const _applyActionCode = useCallback(async (oobCode: string) => {
    try {
      await applyActionCode(auth, oobCode);
    } catch (error) {
      if (errorMap[(error as any).code]) {
        throw new Error(errorMap[(error as any).code]);
      }
      throw error;
    }
  }, []);

  const _signOut = useCallback(async (): Promise<void> => {
    try {
      await signOut(auth);
      CookieHelper.removeItem(CookieKeys.TOKEN);
    } catch (error) {
      if (errorMap[(error as any).code]) {
        throw new Error(errorMap[(error as any).code]);
      }
      throw error;
    }
  }, []);

  const _signOutAnonymously = useCallback(async (): Promise<void> => {
    try {
      await signOut(auth);
      CookieHelper.removeItem(CookieKeys.TOKEN);
    } catch (error) {
      if (errorMap[(error as any).code]) {
        console.log(errorMap[(error as any).code]);
      }
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (state.user?.id && !fbUser) {
      const forceSignOut = async () => {
        setTimeout(async () => {
          await _signOut();
          await _signInAnonymously();
          window.location.href = paths.auth.login;
        }, 1000);
        showSnackbarError('Thông tin xác thực không hợp lệ. Vui lòng đăng nhập lại');
      };
      const timeout = setTimeout(forceSignOut, 1500);
      return () => {
        clearTimeout(timeout);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, fbUser]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        issuer: Issuer.Firebase,
        register,
        changePassword,
        signInWithEmailAndPassword: _signInWithEmailAndPassword,
        signInAnonymously: _signInAnonymously,
        signInWithGoogle,
        sendPasswordResetEmail: _sendPasswordResetEmail,
        verifyPasswordResetCode: _verifyPasswordResetCode,
        confirmPasswordReset: _confirmPasswordReset,
        applyActionCode: _applyActionCode,
        sendEmailVerification: _sendEmailVerification,

        signOut: _signOut,
        signOutAnonymously: _signOutAnonymously
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const AuthConsumer = AuthContext.Consumer;
