import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useContext,
} from "react";
import { AuthorsApi } from "src/api/authors";
import useFunction, {
  DEFAULT_FUNCTION_RETURN,
  UseFunctionReturnType,
} from "src/hooks/use-function";
import { Author, AuthorDetail } from "src/types/author";

interface ContextValue {
  getAuthorsApi: UseFunctionReturnType<FormData, AuthorDetail[]>;

  createAuthor: (requests: Omit<AuthorDetail, "id">) => Promise<void>;
  updateAuthor: (Author: Partial<AuthorDetail>) => Promise<void>;
  deleteAuthor: (ids: Author["id"][]) => Promise<void>;
}

export const AuthorsContext = createContext<ContextValue>({
  getAuthorsApi: DEFAULT_FUNCTION_RETURN,

  createAuthor: async () => {},
  updateAuthor: async () => {},
  deleteAuthor: async () => {},
});

const AuthorsProvider = ({ children }: { children: ReactNode }) => {
  const getAuthorsApi = useFunction(AuthorsApi.getAuthors);

  const createAuthor = useCallback(
    async (request: Omit<AuthorDetail, "id">) => {
      try {
        const id = await AuthorsApi.postAuthor(request);
        if (id) {
          const newAuthors: AuthorDetail[] = [
            {
              ...request,
              id: id.id,
            },
            ...(getAuthorsApi.data || []),
          ];
          getAuthorsApi.setData(newAuthors);
        }
      } catch (error) {
        throw error;
      }
    },
    [getAuthorsApi]
  );

  const updateAuthor = useCallback(
    async (Author: Partial<Author>) => {
      try {
        await AuthorsApi.putAuthors(Author);
        getAuthorsApi.setData(
          (getAuthorsApi.data || []).map((c) =>
            c.id == Author.id ? Object.assign(c, Author) : c
          )
        );
      } catch (error) {
        throw error;
      }
    },
    [getAuthorsApi]
  );

  const deleteAuthor = useCallback(
    async (ids: Author["id"][]) => {
      try {
        await AuthorsApi.deleteAuthor(ids);
        getAuthorsApi.setData([
          ...(getAuthorsApi.data || []).filter(
            (Author) => !ids.includes(Author.id)
          ),
        ]);
      } catch (error) {
        throw error;
      }
    },
    [getAuthorsApi]
  );

  useEffect(() => {
    getAuthorsApi.call(new FormData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthorsContext.Provider
      value={{
        getAuthorsApi,

        createAuthor,
        updateAuthor,
        deleteAuthor,
      }}
    >
      {children}
    </AuthorsContext.Provider>
  );
};

export const useAuthorsContext = () => useContext(AuthorsContext);

export default AuthorsProvider;
