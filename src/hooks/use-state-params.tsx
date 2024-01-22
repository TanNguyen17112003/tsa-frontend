import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import queryString from "query-string";

export function useStateParams<
  T extends { [name in string | number | symbol]: any }
>(initialState: T) {
  const router = useRouter();
  const [state, setState] = useState<T>(initialState);

  useEffect(() => {
    const queryParams = queryString.parse(router.asPath.split(/\?/)[1], {
      parseNumbers: true,
    });
    const newState: any = { ...state };
    Object.keys(state).forEach((value: string) => {
      const key = value as keyof T;
      if (queryParams[value] !== undefined) {
        const queryParam = queryParams[value];
        const tmp =
          typeof state[key] === "number"
            ? Number(queryParam)
            : Object.prototype.toString.call(state[key]) === "[object Date]"
            ? queryParam &&
              (typeof queryParam == "number" || typeof queryParam == "string")
              ? new Date(queryParam)
              : undefined
            : queryParams[value];
        if (tmp != undefined && tmp != null) {
          newState[key] = tmp;
        }
      }
    });
    setState(newState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath]);

  const setParams = useCallback(
    async (state: T) => {
      const query = { ...router.query };
      Object.keys(state).forEach((value: string) => {
        const key = value as keyof T;
        if (Object.prototype.toString.call(state[key]) === "[object Date]") {
          query[value] = state[key].toISOString();
        } else {
          query[value] = state[key];
        }
      });
      router.replace(
        {
          pathname: router.pathname,
          query,
        },
        undefined,
        { shallow: true }
      );
    },
    [router]
  );

  return [state, setParams] as const;
}
