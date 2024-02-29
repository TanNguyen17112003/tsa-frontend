import { useRouter } from "next/router";
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useContext,
  useMemo,
} from "react";
import { GetSutrasPayload, SutrasApi } from "src/api/sutras";
import useFunction, {
  DEFAULT_FUNCTION_RETURN,
  UseFunctionReturnType,
} from "src/hooks/use-function";
import { Sutra, SutraDetail } from "src/types/sutra";
import { useCollectionsContext } from "../collections/collections-context";
import { CollectionDetail } from "src/types/collection";

interface ContextValue {
  collection?: CollectionDetail;
  getSutrasApi: UseFunctionReturnType<GetSutrasPayload, SutraDetail[]>;

  createSutra: (requests: Omit<SutraDetail, "id">) => Promise<void>;
  updateSutra: (Sutra: Partial<SutraDetail>) => Promise<void>;
  deleteSutra: (ids: Sutra["id"][]) => Promise<void>;
}

export const SutrasContext = createContext<ContextValue>({
  getSutrasApi: DEFAULT_FUNCTION_RETURN,

  createSutra: async () => {},
  updateSutra: async () => {},
  deleteSutra: async () => {},
});

const SutrasProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { getCollectionsApi } = useCollectionsContext();
  const collection = useMemo(() => {
    const collectionId = (
      router.query.collectionId ||
      router.query.qCollectionId ||
      ""
    )?.toString();
    return getCollectionsApi.data?.find((c) => c.id == collectionId);
  }, [
    getCollectionsApi.data,
    router.query.collectionId,
    router.query.qCollectionId,
  ]);

  const getSutrasApi = useFunction(SutrasApi.getSutras);

  const createSutra = useCallback(
    async (request: Omit<SutraDetail, "id">) => {
      try {
        const id = await SutrasApi.postSutra(request);
        if (id) {
          const newSutras: SutraDetail[] = [
            {
              ...request,
              id: id,
            },
            ...(getSutrasApi.data || []),
          ];
          getSutrasApi.setData(newSutras);
        }
      } catch (error) {
        throw error;
      }
    },
    [getSutrasApi]
  );

  const updateSutra = useCallback(
    async (Sutra: Partial<Sutra>) => {
      try {
        await SutrasApi.putSutras(Sutra);
        getSutrasApi.setData(
          (getSutrasApi.data || []).map((c) =>
            c.id == Sutra.id ? Object.assign(c, Sutra) : c
          )
        );
      } catch (error) {
        throw error;
      }
    },
    [getSutrasApi]
  );

  const deleteSutra = useCallback(
    async (ids: Sutra["id"][]) => {
      try {
        await SutrasApi.deleteSutra(ids);
        getSutrasApi.setData([
          ...(getSutrasApi.data || []).filter(
            (sutra) => !ids.includes(sutra.id)
          ),
        ]);
      } catch (error) {
        throw error;
      }
    },
    [getSutrasApi]
  );

  useEffect(() => {
    if (collection) {
      getSutrasApi.call({ collection_id: collection.id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection]);

  return (
    <SutrasContext.Provider
      value={{
        collection,
        getSutrasApi,

        createSutra,
        updateSutra,
        deleteSutra,
      }}
    >
      {children}
    </SutrasContext.Provider>
  );
};

export const useSutrasContext = () => useContext(SutrasContext);

export default SutrasProvider;
