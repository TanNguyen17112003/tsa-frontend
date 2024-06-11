import { useCallback, useState } from "react";
import useAppSnackbar from "./use-app-snackbar";

type ApiFunction<P, T> = (payload: P) => Promise<T>;

export interface UseMultipleFunctionOptions {
  successMessage?: string;
  getErrorMessage?: (error: unknown) => string;
  hideSnackbarError?: boolean;
  onSuccess?: () => void;
  onError?: () => void;
}

export interface UseMultipleFunctionReturnType<P, T> {
  call: (
    payload: P[],
    onProgress?: (value: number) => void
  ) => Promise<{ data?: T[]; error?: string }>;
  loading: boolean;
  error: Error | null;
  data: T[] | undefined;
  onProgress?: (progress: number) => void; // Added progress callback
}

export const DEFAULT_FUNCTION_RETURN: UseMultipleFunctionReturnType<any, any> =
  {
    call: async () => ({}),
    loading: false,
    error: null,
    data: undefined,
    onProgress: undefined, // Added undefined for onProgress
  };

function useMultipleFunction<P, T>(
  apiFunction: ApiFunction<P, T>,
  options?: UseMultipleFunctionOptions
): UseMultipleFunctionReturnType<P, T> {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T[]>();

  const { showSnackbarError, showSnackbarSuccess } = useAppSnackbar();

  const onRequestSuccess = useCallback(
    async (results: T[]) => {
      if (options?.successMessage) {
        showSnackbarSuccess(options?.successMessage);
      }
      setData(results);
      options?.onSuccess?.();
      return { data: results };
    },
    [options, showSnackbarSuccess]
  );

  const call = useCallback(
    async (payload: P[], onProgress?: (value: number) => void) => {
      setLoading(true);
      setError(null);
      setData(undefined);

      let callCount = 0;
      const totalCalls = payload.length;
      const results: T[] = [];

      // Use Promise.all to handle multiple API calls simultaneously
      try {
        await Promise.all(
          payload.map(async (p) => {
            const result = await apiFunction(p);
            results.push(result);
            callCount++;
            onProgress?.(callCount / totalCalls); // Update progress
          })
        );
        return await onRequestSuccess(results);
      } catch (error) {
        if (!options?.hideSnackbarError) {
          if (options?.getErrorMessage) {
            showSnackbarError(options.getErrorMessage(error));
          } else {
            if (error) {
              showSnackbarError(error);
            }
          }
        }
        setError(error as Error);
        options?.onError?.();
        return { error: String(error) };
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, onRequestSuccess, options, showSnackbarError]
  );

  return { call, loading, error, data };
}

export default useMultipleFunction;
