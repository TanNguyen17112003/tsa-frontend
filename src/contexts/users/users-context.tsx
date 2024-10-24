import { createContext, ReactNode, useCallback, useEffect, useContext } from 'react';
import { UsersApi } from 'src/api/users';
import useFunction, {
  DEFAULT_FUNCTION_RETURN,
  UseFunctionReturnType
} from 'src/hooks/use-function';
import { User, UserDetail } from 'src/types/user';
import { UpdateProfileRequest } from 'src/api/users';
import { useAuth } from '@hooks';
import { useFirebaseAuth } from '@hooks';

interface ContextValue {
  getUsersApi: UseFunctionReturnType<FormData, Partial<UserDetail>>;
  getListUsersApi: UseFunctionReturnType<FormData, UserDetail[]>;
  updateProfile: (request: UpdateProfileRequest) => Promise<void>;
  deleteUser: (id: UserDetail['id']) => Promise<void>;
}

export const UsersContext = createContext<ContextValue>({
  getUsersApi: DEFAULT_FUNCTION_RETURN,
  getListUsersApi: DEFAULT_FUNCTION_RETURN,
  updateProfile: async () => {},
  deleteUser: async () => {}
});

const UsersProvider = ({ children }: { children: ReactNode }) => {
  const getUsersApi = useFunction(UsersApi.me);
  const getListUsersApi = useFunction(UsersApi.getUsers);

  const { user } = useAuth();
  const { user: firebaseUser } = useFirebaseAuth();

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

  const deleteUser = useCallback(
    async (id: UserDetail['id']) => {
      try {
        await UsersApi.deleteUser(id);
        getListUsersApi.setData((getListUsersApi.data || []).filter((user) => user.id !== id));
      } catch (err) {
        throw err;
      }
    },
    [getListUsersApi]
  );

  useEffect(() => {
    getUsersApi.call(new FormData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user?.role === 'ADMIN' || firebaseUser?.role === 'ADMIN') {
      getListUsersApi.call(new FormData());
    }
  }, [user, firebaseUser]);

  return (
    <UsersContext.Provider
      value={{
        getUsersApi,
        getListUsersApi,
        updateProfile,
        deleteUser
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export const useUsersContext = () => useContext(UsersContext);

export default UsersProvider;
