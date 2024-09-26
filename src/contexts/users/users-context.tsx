import { createContext, ReactNode, useCallback, useEffect, useContext } from 'react';
import { UsersApi } from 'src/api/users';
import useFunction, {
  DEFAULT_FUNCTION_RETURN,
  UseFunctionReturnType
} from 'src/hooks/use-function';
import { User, UserDetail } from 'src/types/user';
import { UpdateProfileRequest } from 'src/api/users';

interface ContextValue {
  getUsersApi: UseFunctionReturnType<FormData, Partial<UserDetail>>;
  updateProfile: (request: UpdateProfileRequest) => Promise<void>;
}

export const UsersContext = createContext<ContextValue>({
  getUsersApi: DEFAULT_FUNCTION_RETURN,
  updateProfile: async () => {}
});

const UsersProvider = ({ children }: { children: ReactNode }) => {
  const getUsersApi = useFunction(UsersApi.me);

  const updateProfile = useCallback(
    async (request: UpdateProfileRequest) => {
      try {
        const result = await UsersApi.updateProfile(request);
        getUsersApi.setData(getUsersApi.data ? { ...getUsersApi.data, ...result } : result);
      } catch (err) {
        throw err;
      }
    },
    [getUsersApi]
  );

  useEffect(() => {
    getUsersApi.call(new FormData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UsersContext.Provider
      value={{
        getUsersApi,
        updateProfile
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export const useUsersContext = () => useContext(UsersContext);

export default UsersProvider;
