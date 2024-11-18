import type { FC, ReactNode } from 'react';
import { createContext, useCallback, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { UpdateProfileRequest, UsersApi } from 'src/api/users';
import type { UserDetail } from 'src/types/user';
import { Issuer } from 'src/utils/auth';
import CookieHelper, { CookieKeys } from 'src/utils/cookie-helper';
import { useRouter } from 'next/router';
import { paths } from 'src/paths';
import { SignUpRequest, InitialSignUpRequest } from 'src/api/users';

interface State {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: UserDetail | null;
}

enum ActionType {
  INITIALIZE = 'INITIALIZE',
  SIGN_IN = 'SIGN_IN',
  SIGN_UP = 'SIGN_UP',
  SIGN_OUT = 'SIGN_OUT',
  UPDATE_PROFILE = 'UPDATE_PROFILE'
}

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

type SignUpAction = {
  type: ActionType.SIGN_UP;
  payload: {
    user: UserDetail;
  };
};

type SignOutAction = {
  type: ActionType.SIGN_OUT;
};

type UpdateProfileAction = {
  type: ActionType.UPDATE_PROFILE;
  payload: {
    user: UserDetail;
  };
};

type Action = InitializeAction | SignInAction | SignUpAction | SignOutAction | UpdateProfileAction;

type Handler = (state: State, action: any) => State;

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
  SIGN_UP: (state: State, action: SignUpAction): State => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  SIGN_OUT: (state: State): State => ({
    ...state,
    isAuthenticated: false,
    user: null
  }),
  UPDATE_PROFILE: (state: State, action: UpdateProfileAction): State => ({
    ...state,
    user: action.payload.user
  })
};

const reducer = (state: State, action: Action): State =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

export interface AuthContextType extends State {
  issuer: Issuer.JWT;
  signIn: (email: string, password: string) => Promise<UserDetail | undefined>;
  initiateSignUp: (request: InitialSignUpRequest) => Promise<void>;
  completeSignUp: (request: SignUpRequest) => Promise<void>;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updateProfile?: (request: UpdateProfileRequest) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  ...initialState,
  issuer: Issuer.JWT,
  signIn: () => Promise.resolve(undefined),
  initiateSignUp: () => Promise.resolve(),
  completeSignUp: () => Promise.resolve(),
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
  const router = useRouter();

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
            partialUser.firstName &&
            partialUser.lastName &&
            partialUser.role
          ) {
            user = partialUser as UserDetail;
          } else {
            throw new Error('Incomplete user data');
          }
        } catch {}
        if (!user) {
          user = await JSON.parse(localStorage.getItem('user_data') || '{}');
          if (!user || !user.id || !user.role || !user.firstName || !user.lastName) {
            throw new Error('Get user failed.');
          }
        }
        dispatch({
          type: ActionType.INITIALIZE,
          payload: {
            isAuthenticated: true,
            user: user || null
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
  }, [dispatch]);

  useEffect(
    () => {
      initialize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const signIn = useCallback(
    async (email: string, password: string): Promise<UserDetail | undefined> => {
      try {
        const response = await UsersApi.signIn({ email, password });
        if (response && response.accessToken && response.userInfo) {
          const userInfo = { ...response.userInfo, authMethod: 'jwt' as const };
          CookieHelper.setItem(CookieKeys.TOKEN, response.accessToken);
          CookieHelper.setItem(CookieKeys.REFRESH_TOKEN, response.refreshToken);
          CookieHelper.setItem('user_data', JSON.stringify(userInfo));
          dispatch({
            type: ActionType.SIGN_IN,
            payload: {
              user: userInfo
            }
          });
          return userInfo;
        } else {
          console.error('Invalid signIn response:', response);
          return undefined;
        }
      } catch (error) {
        console.error('SignIn error:', error);
        return undefined;
      }
    },
    [dispatch]
  );

  const initiateSignUp = useCallback(async (request: InitialSignUpRequest): Promise<void> => {
    try {
      await UsersApi.initiateSignUp(request);
    } catch (error) {
      throw error;
    }
  }, []);

  const completeSignUp = useCallback(
    async (request: SignUpRequest): Promise<void> => {
      const response = await UsersApi.completeSignUp(request);
      dispatch({
        type: ActionType.SIGN_UP,
        payload: {
          user: {
            id: response.id,
            firstName: response.firstName,
            lastName: response.lastName,
            phoneNumber: response.phoneNumber,
            role: 'STUDENT',
            createdAt: response.createdAt,
            email: response.email
          }
        }
      });
    },
    [dispatch]
  );

  const signOut = useCallback(async (): Promise<void> => {
    const refreshToken = CookieHelper.getItem(CookieKeys.REFRESH_TOKEN);
    if (refreshToken) {
      await UsersApi.signOut(refreshToken);
    }
    CookieHelper.removeItem(CookieKeys.TOKEN);
    CookieHelper.removeItem(CookieKeys.REFRESH_TOKEN);
    dispatch({ type: ActionType.SIGN_OUT });
    router.push(paths.auth.login);
  }, [router]);

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
          await signOut();
        }
      } catch (error) {
        console.error('RefreshToken error:', error);
        await signOut();
      }
    } else {
      await signOut();
    }
  }, [signOut]);

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

  return (
    <AuthContext.Provider
      value={{
        ...state,
        issuer: Issuer.JWT,
        signIn,
        initiateSignUp,
        completeSignUp,
        signOut,
        refreshToken,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.any.isRequired
};

export const AuthConsumer = AuthContext.Consumer;
