import type { FC, ReactNode } from 'react';
import { createContext, useCallback, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { UsersApi } from 'src/api/users';
import type { UserDetail } from 'src/types/user';
import { Issuer } from 'src/utils/auth';
import CookieHelper, { CookieKeys } from 'src/utils/cookie-helper';
import { useRouter } from 'next/router';
import { paths } from 'src/paths';

interface State {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: UserDetail | null;
}

enum ActionType {
  INITIALIZE = 'INITIALIZE',
  SIGN_IN = 'SIGN_IN',
  SIGN_OUT = 'SIGN_OUT'
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

type SignOutAction = {
  type: ActionType.SIGN_OUT;
};

type Action = InitializeAction | SignInAction | SignOutAction;

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
  SIGN_OUT: (state: State): State => ({
    ...state,
    isAuthenticated: false,
    user: null
  })
};

const reducer = (state: State, action: Action): State =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

export interface AuthContextType extends State {
  issuer: Issuer.JWT;
  signIn: (email: string, password: string) => Promise<UserDetail | undefined>;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  ...initialState,
  issuer: Issuer.JWT,
  signIn: () => Promise.resolve(undefined),
  signOut: () => Promise.resolve(),
  refreshToken: () => Promise.resolve()
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
        if (user.role === 'STUDENT') {
          router.replace(paths.student.order.index);
        } else if (user.role === 'ADMIN') {
          router.replace(paths.dashboard.index);
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
          CookieHelper.setItem(CookieKeys.TOKEN, response.accessToken);
          CookieHelper.setItem(CookieKeys.REFRESH_TOKEN, response.refreshToken);
          CookieHelper.setItem('user_data', JSON.stringify(response.userInfo));
          dispatch({
            type: ActionType.SIGN_IN,
            payload: {
              user: response.userInfo
            }
          });
          return response.userInfo;
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

  return (
    <AuthContext.Provider
      value={{
        ...state,
        issuer: Issuer.JWT,
        signIn,
        signOut,
        refreshToken
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
