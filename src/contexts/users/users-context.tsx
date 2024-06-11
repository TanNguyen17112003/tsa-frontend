import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useContext,
} from "react";
import { UsersApi } from "src/api/users";
import useFunction, {
  DEFAULT_FUNCTION_RETURN,
  UseFunctionReturnType,
} from "src/hooks/use-function";
import { User, UserDetail } from "src/types/user";

interface ContextValue {
  getUsersApi: UseFunctionReturnType<FormData, UserDetail[]>;

  createUser: (requests: Omit<UserDetail, "id">) => Promise<void>;
  updateUser: (User: Partial<UserDetail>) => Promise<void>;
  deleteUser: (ids: User["id"][]) => Promise<void>;
}

export const UsersContext = createContext<ContextValue>({
  getUsersApi: DEFAULT_FUNCTION_RETURN,

  createUser: async () => {},
  updateUser: async () => {},
  deleteUser: async () => {},
});

const UsersProvider = ({ children }: { children: ReactNode }) => {
  const getUsersApi = useFunction(UsersApi.getUsers);

  const createUser = useCallback(
    async (request: Omit<UserDetail, "id">) => {
      try {
        const user = await UsersApi.postUser(request);
        if (user) {
          const newUsers: UserDetail[] = [
            {
              ...request,
              id: user.id,
            },
            ...(getUsersApi.data || []),
          ];
          getUsersApi.setData(newUsers);
        }
      } catch (error) {
        throw error;
      }
    },
    [getUsersApi]
  );

  const updateUser = useCallback(
    async (User: Partial<User>) => {
      try {
        await UsersApi.putUser(User);
        getUsersApi.setData(
          (getUsersApi.data || []).map((c) =>
            c.id == User.id ? Object.assign(c, User) : c
          )
        );
      } catch (error) {
        throw error;
      }
    },
    [getUsersApi]
  );

  const deleteUser = useCallback(
    async (ids: User["id"][]) => {
      try {
        const results = await Promise.allSettled(
          ids.map((id) => UsersApi.deleteUser(ids))
        );
        getUsersApi.setData([
          ...(getUsersApi.data || []).filter(
            (User) =>
              !results.find(
                (result, index) =>
                  result.status == "fulfilled" && ids[index] == User.id
              )
          ),
        ]);
        results.forEach((result, index) => {
          if (result.status == "rejected") {
            throw new Error(
              "Không thể xoá danh mục: " +
                ids[index] +
                ". " +
                result.reason.toString()
            );
          }
        });
      } catch (error) {
        throw error;
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

        createUser,
        updateUser,
        deleteUser,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export const useUsersContext = () => useContext(UsersContext);

export default UsersProvider;
