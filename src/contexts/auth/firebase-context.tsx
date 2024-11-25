import type { User as FirebaseUser } from '@firebase/auth';
import {
  applyActionCode,
  confirmPasswordReset,
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
import { UpdateProfileRequest, UsersApi } from 'src/api/users';
import useAppSnackbar from 'src/hooks/use-app-snackbar';
import { errorMap, firebaseApp } from 'src/libs/firebase';
import { paths } from 'src/paths';
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
  UPDATE_PROFILE = 'UPDATE_PROFILE'
}

type UpdateAction = {
  type: ActionType.UPDATE_PROFILE;
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
  UPDATE_PROFILE: (state: State, action: UpdateAction): State => {
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
  changePassword: (
    currentPassword: string,
    newPassword: string,
    reTypeNewPassword: string
  ) => Promise<any>;
  signInWithGoogle: () => Promise<UserDetail | null>;

  signOut: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updateProfile?: (request: UpdateProfileRequest) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  ...initialState,
  issuer: Issuer.Firebase,
  changePassword: () => Promise.resolve(),
  signInWithGoogle: () => Promise.resolve(null),
  signOut: () => Promise.resolve(),
  refreshToken: () => Promise.resolve(),
  updateProfile: () => Promise.resolve()
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = (props) => {
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
  }, []);

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

        const userInfo: UserDetail = { ...response.userInfo, authMethod: 'firebase' };
        CookieHelper.setItem(CookieKeys.TOKEN, response.accessToken);
        CookieHelper.setItem(CookieKeys.REFRESH_TOKEN, response.refreshToken);
        localStorage.setItem('user_data', JSON.stringify(userInfo));

        dispatch({
          type: ActionType.SIGN_IN,
          payload: {
            user: userInfo
          }
        });
        setFbUser(user);
        return userInfo;
      } catch (error) {
        if (errorMap[(error as any).code]) {
          throw new Error(errorMap[(error as any).code]);
        }
        throw error;
      }
    },
    [dispatch]
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

  const _signOut = useCallback(async (): Promise<void> => {
    try {
      await signOut(auth);
      CookieHelper.removeItem(CookieKeys.TOKEN);
      CookieHelper.removeItem(CookieKeys.REFRESH_TOKEN);
      dispatch({
        type: ActionType.INITIALIZE,
        payload: {
          isAuthenticated: false,
          user: null
        }
      });
      setFbUser(null); // Reset the Firebase user state
    } catch (error) {
      if (errorMap[(error as any).code]) {
        throw new Error(errorMap[(error as any).code]);
      }
      throw error;
    }
  }, [dispatch]);

  const refreshToken = useCallback(async (): Promise<void> => {
    const refreshToken = CookieHelper.getItem(CookieKeys.REFRESH_TOKEN);
    if (refreshToken) {
      try {
        const response = await UsersApi.refreshToken(refreshToken);
        if (response && response.accessToken && response.refreshToken) {
          CookieHelper.setItem(CookieKeys.TOKEN, response.accessToken);
          CookieHelper.setItem(CookieKeys.REFRESH_TOKEN, response.refreshToken);
        } else {
          console.error('Invalid refreshToken response:', response);
          await _signOut();
        }
      } catch (error) {
        console.error('RefreshToken error:', error);
        await _signOut();
      }
    } else {
      await _signOut();
    }
  }, [_signOut]);

  const updateProfile = useCallback(
    async (request: UpdateProfileRequest) => {
      try {
        await UsersApi.updateProfile(request);
        const currentUserInfo = JSON.parse(CookieHelper.getItem('user_data') as string);
        const newUserInfo = {
          ...currentUserInfo,
          firstName: request.firstName || currentUserInfo.firstName,
          lastName: request.lastName || currentUserInfo.lastName,
          phoneNumber: request.phoneNumber || currentUserInfo.phoneNumber,
          photoUrl: request.photoUrl || currentUserInfo.photoUrl,
          dormitory: request.dormitory || currentUserInfo.dormitory || '',
          building: request.building || currentUserInfo.building || '',
          room: request.room || currentUserInfo.room || ''
        };
        CookieHelper.setItem('user_data', JSON.stringify(newUserInfo));
        dispatch({
          type: ActionType.UPDATE_PROFILE,
          payload: {
            user: newUserInfo
          }
        });
      } catch (error) {
        throw error;
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (state.user?.id && state.user.authMethod === 'firebase' && !fbUser) {
      const forceSignOut = async () => {
        setTimeout(async () => {
          await _signOut();
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
        changePassword,
        signInWithGoogle,
        signOut: _signOut,
        refreshToken,
        updateProfile
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
