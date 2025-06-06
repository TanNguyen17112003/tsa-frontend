import { createContext, ReactNode, useCallback, useEffect, useContext } from 'react';
import { UpdateUserStatus, UsersApi } from 'src/api/users';
import useFunction, {
  DEFAULT_FUNCTION_RETURN,
  UseFunctionReturnType
} from 'src/hooks/use-function';
import { UserDetail, UserStatus } from 'src/types/user';
import { useAuth } from '@hooks';
import { useFirebaseAuth } from '@hooks';

interface ContextValue {
  getListUsersApi: UseFunctionReturnType<FormData, UserDetail[]>;
  deleteUser: (id: UserDetail['id']) => Promise<void>;
  updateUserStatus: (id: UserDetail['id'], status: UpdateUserStatus) => Promise<void>;
}

export const UsersContext = createContext<ContextValue>({
  getListUsersApi: DEFAULT_FUNCTION_RETURN,
  deleteUser: async () => {},
  updateUserStatus: async () => {}
});

const UsersProvider = ({ children }: { children: ReactNode }) => {
  const getListUsersApi = useFunction(UsersApi.getUsers);

  const { user } = useAuth();
  const { user: firebaseUser } = useFirebaseAuth();

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

  const updateUserStatus = useCallback(
    async (id: UserDetail['id'], status: UpdateUserStatus) => {
      try {
        await UsersApi.updateUserStatus(id, status);
        getListUsersApi.setData(
          (getListUsersApi.data || []).map((user) => {
            if (user.id === id) {
              return { ...user, status: status.status };
            }
            return user;
          })
        );
      } catch (err) {
        throw err;
      }
    },
    [getListUsersApi]
  );

  useEffect(() => {
    if (user?.role === 'ADMIN' || firebaseUser?.role === 'ADMIN') {
      getListUsersApi.call(new FormData());
    }
  }, [user, firebaseUser]);

  return (
    <UsersContext.Provider
      value={{
        getListUsersApi,
        deleteUser,
        updateUserStatus
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export const useUsersContext = () => useContext(UsersContext);

export default UsersProvider;
